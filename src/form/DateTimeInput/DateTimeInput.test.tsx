import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import moment from 'moment';
import Datetime from 'react-datetime';

import DateTimeInput, { IsDateAllowed, Mode } from './DateTimeInput';
import * as FormatError from './hooks/useHasFormatError';
import * as IsModalOpen from './hooks/useIsModalOpen';
import * as UseSetLastStringValue from './hooks/useSetLastStringValue';

describe('Component: DateTimeInput', () => {
  let dateTimeInput: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;
  let onFocusSpy: jest.Mock;
  let setUseSetLastStringValueSpy: jest.Mock;

  function setup({
    value,
    isDateAllowed,
    hasLabel = true,
    mode
  }: {
    value?: Date;
    isDateAllowed?: IsDateAllowed;
    hasLabel?: boolean;
    mode?: Mode;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    onFocusSpy = jest.fn();

    setUseSetLastStringValueSpy = jest.fn();
    jest
      .spyOn(UseSetLastStringValue, 'useSetLastStringValue')
      .mockReturnValue(['', setUseSetLastStringValueSpy]);

    const props = {
      id: 'dateOfBirth',
      placeholder: 'Please enter your date of birth',
      isDateAllowed,
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      onFocus: onFocusSpy,
      error: 'Some error',
      valid: true,
      mode
    };

    if (hasLabel) {
      dateTimeInput = shallow(
        <DateTimeInput label="Date of birth" color="success" {...props} />
      );
    } else {
      dateTimeInput = shallow(<DateTimeInput color="success" {...props} />);
    }
  }

  describe('ui', () => {
    test('with label', () => {
      setup({ value: new Date(2000, 0, 1, 12, 30, 40) });

      expect(toJson(dateTimeInput)).toMatchSnapshot(
        'Component: DateTimeInput => ui => with label'
      );
    });

    test('without label', () => {
      setup({
        value: new Date(2000, 0, 1, 12, 30, 40),
        hasLabel: false
      });

      expect(toJson(dateTimeInput)).toMatchSnapshot(
        'Component: DateTimeInput => ui => without label'
      );
    });

    test('with format error', () => {
      jest
        .spyOn(FormatError, 'useHasFormatError')
        .mockImplementation(() => [true, jest.fn()]);

      setup({ value: new Date(2000, 0, 1, 12, 30, 40), hasLabel: true });

      expect(toJson(dateTimeInput)).toMatchSnapshot(
        'Component: DateTimeInput => ui => with format error'
      );
    });

    test('with date picker in modal', () => {
      setup({ mode: 'modal' });

      expect(toJson(dateTimeInput)).toMatchSnapshot(
        'Component: DateTimeInput => ui => with date picker in modal'
      );
    });

    test('MaskedInput', () => {
      setup({});

      const input = shallow(
        // @ts-ignore
        dateTimeInput
          .find(Datetime)
          .props()
          // @ts-ignore
          .renderInput({ id: 10 })
      );

      expect(toJson(input)).toMatchSnapshot(
        'Component: DateTimeInput => ui => MaskedInput'
      );
    });

    test('InputGroup', () => {
      setup({ mode: 'modal' });

      const inputGroup = shallow(
        // @ts-ignore
        dateTimeInput
          .find(Datetime)
          .props()
          // @ts-ignore
          .renderInput({ id: 10 })
      );

      expect(toJson(inputGroup)).toMatchSnapshot(
        'Component: DateTimeInput => ui => InputGroup'
      );
    });
  });

  describe('lifecycle events', () => {
    it('should not throw an error when dateFormat is filled in', () => {
      expect(() => {
        shallow(
          <DateTimeInput
            id="dateOfBirth"
            dateFormat="YYYY-MM-DD"
            timeFormat={false}
            onChange={jest.fn()}
          />
        );
      }).not.toThrowError(
        'DateTimeInput: dateFormat and timeFormat cannot both be false'
      );
    });

    it('should not throw an error when timeFormat is filled in', () => {
      expect(() => {
        shallow(
          <DateTimeInput
            id="dateOfBirth"
            dateFormat={false}
            timeFormat="HH:mm:ss"
            onChange={jest.fn()}
          />
        );
      }).not.toThrowError(
        'DateTimeInput: dateFormat and timeFormat cannot both be false'
      );
    });

    it('should throw an error when dateFormat and timeFormat are both false', () => {
      expect(() => {
        shallow(
          <DateTimeInput
            id="dateOfBirth"
            dateFormat={false}
            timeFormat={false}
            onChange={jest.fn()}
          />
        );
      }).toThrowError(
        'DateTimeInput: dateFormat and timeFormat cannot both be false'
      );
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      it('should when the value is a string which is a valid date set the value', () => {
        setup({});

        const dateTime = dateTimeInput.find(Datetime);
        // @ts-ignore
        dateTime.props().onChange('2000-01-01 12:00:00');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(
          new Date('2000-01-01T11:00:00.000Z')
        );

        expect(onBlurSpy).toHaveBeenCalledTimes(0);

        // should set the lastStringValue to the string of the date
        expect(setUseSetLastStringValueSpy).toBeCalledTimes(1);
        expect(setUseSetLastStringValueSpy).toBeCalledWith(
          '2000-01-01 12:00:00'
        );
      });

      it('should when the value is a string which is not a valid value call onChange with null', () => {
        setup({});

        const dateTime = dateTimeInput.find(Datetime);
        // @ts-ignore
        dateTime.props().onChange('2000-__-__ __:__:__');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);

        expect(onBlurSpy).toHaveBeenCalledTimes(0);

        // should set the lastStringValue to the invalid string
        expect(setUseSetLastStringValueSpy).toBeCalledTimes(1);
        expect(setUseSetLastStringValueSpy).toBeCalledWith(
          '2000-__-__ __:__:__'
        );
      });

      it('should be marked as invalid when the value is a string which is not a valid value', () => {
        setup({});

        const dateTime = dateTimeInput.find(Datetime);
        // @ts-ignore
        dateTime.props().onChange('2000-__-__ __:__:__');

        const updatedDateTime = dateTimeInput.find(Datetime);
        // @ts-ignore
        expect(updatedDateTime.props().inputProps.invalid).toBe(true);
      });

      it('should be marked as invalid when the value is a string which is not a valid value and the input was initialized with a value', () => {
        setup({ value: new Date('2020-01-01T11:00:00.000Z') });

        const dateTime = dateTimeInput.find(Datetime);
        // @ts-ignore
        dateTime.props().onChange('2000-__-__ __:__:__');

        const updatedDateTime = dateTimeInput.find(Datetime);
        // @ts-ignore
        expect(updatedDateTime.props().inputProps.invalid).toBe(true);
      });

      it('should set the value when a valid moment object is given', () => {
        setup({});

        const dateTime = dateTimeInput.find(Datetime);

        const date = new Date(1989, 2, 21);
        const value = { toDate: () => date };
        // @ts-ignore
        dateTime.props().onChange(value);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(date);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);

        // should set the lastStringValue to the format of the date
        expect(setUseSetLastStringValueSpy).toBeCalledTimes(1);
        expect(setUseSetLastStringValueSpy).toBeCalledWith(
          '1989-03-21 00:00:00'
        );
      });
    });

    test('onFocus', () => {
      setup({});

      const dateTime = dateTimeInput.find(Datetime);
      // @ts-ignore
      dateTime.props().onOpen();

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    describe('isValidDate', () => {
      it('should when "isDateAllowed" is not defined always be true', () => {
        setup({});

        const dateTime = dateTimeInput.find(Datetime);

        // @ts-ignore
        expect(dateTime.props().isValidDate()).toBe(true);
      });

      it('should when "isDateAllowed" is defined use that to determine the valid date', () => {
        const isDateAllowedSpy = jest.fn();
        setup({ isDateAllowed: isDateAllowedSpy });

        const dateTime = dateTimeInput.find(Datetime);

        const date = moment();
        const current = moment();
        // @ts-ignore
        dateTime.props().isValidDate(date, current);

        expect(isDateAllowedSpy).toHaveBeenCalledTimes(1);
        expect(isDateAllowedSpy).toHaveBeenCalledWith(date, current);
      });
    });

    describe('toggle modal', () => {
      test('open modal on button click', () => {
        const setIsModalOpenSpy = jest.fn();
        jest
          .spyOn(IsModalOpen, 'useIsModalOpen')
          .mockReturnValue([false, setIsModalOpenSpy]);

        setup({ mode: 'modal' });

        const inputGroup = shallow(
          // @ts-ignore
          dateTimeInput
            .find(Datetime)
            .props()
            // @ts-ignore
            .renderInput({ id: 10 })
        );

        // @ts-ignore
        inputGroup
          .find('Addon')
          .props()
          // @ts-ignore
          .onClick();

        expect(setIsModalOpenSpy).toBeCalledTimes(1);
        expect(setIsModalOpenSpy).toBeCalledWith(true);
      });

      test('close modal', () => {
        const setIsModalOpenSpy = jest.fn();
        jest
          .spyOn(IsModalOpen, 'useIsModalOpen')
          .mockReturnValue([true, setIsModalOpenSpy]);

        setup({ mode: 'modal' });

        // @ts-ignore
        dateTimeInput
          .find('DateTimeModal')
          .props()
          // @ts-ignore
          .onClose();

        expect(setIsModalOpenSpy).toBeCalledTimes(1);
        expect(setIsModalOpenSpy).toBeCalledWith(false);
      });

      test('close modal on clicking select button', () => {
        const setIsModalOpenSpy = jest.fn();
        jest
          .spyOn(IsModalOpen, 'useIsModalOpen')
          .mockReturnValue([true, setIsModalOpenSpy]);

        setup({ mode: 'modal' });

        // @ts-ignore
        dateTimeInput
          .find('DateTimeModal')
          .props()
          // @ts-ignore
          .onSave(moment());

        expect(setIsModalOpenSpy).toBeCalledTimes(1);
        expect(setIsModalOpenSpy).toBeCalledWith(false);
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const value = new Date(1989, 2, 21);

      setup({ value });

      let dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe(value);

      dateTimeInput.setProps({ value: undefined });

      dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe('');
    });

    test('becomes filled', () => {
      setup({});

      let dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe('');

      const value = new Date(1989, 2, 21);
      dateTimeInput.setProps({ value });

      dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe(value);
    });
  });
});
