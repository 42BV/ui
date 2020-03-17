import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import moment from 'moment';
import Datetime from 'react-datetime';

import DateTimeInput, { IsDateAllowed, maskedInput } from './DateTimeInput';

describe('Component: DateTimeInput', () => {
  let dateTimeInput: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;
  let onFocusSpy: jest.Mock;

  function setup({
    value,
    isDateAllowed,
    hasLabel = true
  }: {
    value?: Date;
    isDateAllowed?: IsDateAllowed;
    hasLabel?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    onFocusSpy = jest.fn();

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
      valid: true
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
      setup({ value: new Date(2000, 0, 1, 12, 30, 40) });

      dateTimeInput.setState({ hasFormatError: true });

      expect(toJson(dateTimeInput)).toMatchSnapshot(
        'Component: DateTimeInput => ui => with format error'
      );
    });
  });

  describe('lifecycle events', () => {
    describe('componentDidMount', () => {
      it('should not an error when dateFormat is filled in', () => {
        // @ts-ignore
        const dateTimeInput = new DateTimeInput();
        dateTimeInput.props = { dateFormat: 'YYYY-MM-DD', timeFormat: false };

        expect(() => {
          dateTimeInput.componentDidMount();
        }).not.toThrowError(
          'DateTimeInput: dateFormat and timeFormat cannot both be false'
        );
      });

      it('should not an error when timeFormat is filled in', () => {
        // @ts-ignore
        const dateTimeInput = new DateTimeInput();
        dateTimeInput.props = { dateFormat: false, timeFormat: 'HH:mm:ss' };

        expect(() => {
          dateTimeInput.componentDidMount();
        }).not.toThrowError(
          'DateTimeInput: dateFormat and timeFormat cannot both be false'
        );
      });

      it('should throw an error when dateFormat and timeFormat are both false', () => {
        // @ts-ignore;
        const dateTimeInput = new DateTimeInput();
        dateTimeInput.props = { dateFormat: false, timeFormat: false };

        expect(() => {
          dateTimeInput.componentDidMount();
        }).toThrowError(
          'DateTimeInput: dateFormat and timeFormat cannot both be false'
        );
      });
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
      });

      it('should when the value is a string which is not a valid value call set the value with null', () => {
        setup({});

        const dateTime = dateTimeInput.find(Datetime);
        // @ts-ignore
        dateTime.props().onChange('2000-__-__ __:__:__');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);

        expect(onBlurSpy).toHaveBeenCalledTimes(0);
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
      });
    });

    test('onFocus', () => {
      setup({});

      const dateTime = dateTimeInput.find(Datetime);
      // @ts-ignore
      dateTime.props().onFocus();

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
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const value = new Date(1989, 2, 21);

      setup({ value });

      let dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe(value);

      dateTimeInput.setProps({ value: undefined });

      dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe(undefined);
    });

    test('becomes filled', () => {
      setup({});

      let dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe(undefined);

      const value = new Date(1989, 2, 21);
      dateTimeInput.setProps({ value });

      dateTime = dateTimeInput.find(Datetime);
      expect(dateTime.props().value).toBe(value);
    });
  });
});

test('MaskedInputWrapper', () => {
  const input = shallow(maskedInput({ id: 10 }));
  expect(toJson(input)).toMatchSnapshot('maskedInput');
});
