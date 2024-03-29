import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  DateTimeInput,
  DateTimeInputIsDateAllowed,
  DateTimeInputMode,
  FieldDateTimeInput,
  JarbDateTimeInput
} from './DateTimeInput';
import * as Validators from './validators';
import { Form } from 'react-final-form';
import { setConstraints } from '@42.nl/jarb-final-form';
import { Tooltip } from '../../core/Tooltip/Tooltip';

describe('Component: DateTimeInput', () => {
  function setup({
    value,
    isDateAllowed,
    hasLabel,
    mode
  }: {
    value?: Date | string;
    isDateAllowed?: DateTimeInputIsDateAllowed;
    hasLabel?: boolean;
    mode?: DateTimeInputMode;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();
    const onFocusSpy = jest.fn();

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
      mode,
      label: 'Date of birth',
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(
      <DateTimeInput color="success" {...props} />
    );

    return { container, props, rerender, onChangeSpy, onFocusSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('visible label', () => {
      const { container } = setup({
        hasLabel: true,
        value: new Date(2000, 0, 1, 12, 30, 40)
      });
      expect(screen.queryByText('Date of birth')).toBeInTheDocument();
      expect(
        screen.queryByLabelText('Date of birth(YYYY-MM-DD HH:mm:ss)')
      ).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Date of birth')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Date of birth')).toBeInTheDocument();
    });

    test('with value', () => {
      setup({ value: new Date(2000, 0, 1, 12, 30, 40) });
      expect(screen.queryByText('close')).toBeInTheDocument();
    });

    test('with date picker in modal', () => {
      jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

      setup({
        mode: 'modal',
        value: new Date(2000, 0, 1, 12, 30, 40)
      });

      expect(screen.queryByText('calendar_today')).toBeInTheDocument();

      expect(document.body.lastChild).toMatchSnapshot();
    });
  });

  describe('either dateFormat or timeFormat is required', () => {
    it('should not throw an error when dateFormat is filled in', () => {
      expect(() => {
        render(
          <DateTimeInput
            id="dateOfBirth"
            dateFormat="YYYY-MM-DD"
            timeFormat={false}
            onChange={jest.fn()}
            label="Date of birth"
          />
        );
      }).not.toThrowError(
        'DateTimeInput: dateFormat and timeFormat cannot both be false'
      );
    });

    it('should not throw an error when timeFormat is filled in', () => {
      expect(() => {
        render(
          <DateTimeInput
            id="dateOfBirth"
            dateFormat={false}
            timeFormat="HH:mm:ss"
            onChange={jest.fn()}
            label="Date of birth"
          />
        );
      }).not.toThrowError(
        'DateTimeInput: dateFormat and timeFormat cannot both be false'
      );
    });

    it('should throw an error when dateFormat and timeFormat are both false', () => {
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
      expect(() => {
        render(
          <DateTimeInput
            id="dateOfBirth"
            dateFormat={false}
            timeFormat={false}
            onChange={jest.fn()}
            label="Date of birth"
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
        const { onChangeSpy } = setup({});

        fireEvent.change(
          screen.getByPlaceholderText('Please enter your date of birth'),
          { target: { value: '2000-01-01 12:00:00' } }
        );

        expect(onChangeSpy).toHaveBeenCalled();
        expect(onChangeSpy).toHaveBeenLastCalledWith(
          new Date('2000-01-01T12:00:00.000Z')
        );
      });

      it('should when the value is a string which is not a valid date call onChange with invalid date string', () => {
        const { onChangeSpy, onBlurSpy } = setup({});

        fireEvent.change(
          screen.getByPlaceholderText('Please enter your date of birth'),
          { target: { value: '2000-42-42 42:42:42' } }
        );

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith('2000-42-42 42:42:42');

        expect(onBlurSpy).toHaveBeenCalledTimes(0);
      });

      it('should when the value is a string which is not a valid value call onChange with invalid string value', () => {
        const { onChangeSpy, onBlurSpy } = setup({});

        fireEvent.change(
          screen.getByPlaceholderText('Please enter your date of birth'),
          { target: { value: '2000-__-__ __:__:__' } }
        );

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith('2000-__-__ __:__:__');

        expect(onBlurSpy).toHaveBeenCalledTimes(0);
      });
    });

    test('onFocus', () => {
      const { onFocusSpy } = setup({});
      fireEvent.focus(
        screen.getByPlaceholderText('Please enter your date of birth')
      );
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    describe('isValidDate', () => {
      it('should when "isDateAllowed" is defined use that to determine the valid date', () => {
        const isDateAllowedSpy = jest.fn();
        setup({ isDateAllowed: isDateAllowedSpy });
        expect(isDateAllowedSpy).toHaveBeenCalledTimes(42);
      });
    });

    describe('toggle modal', () => {
      test('open modal on button click', () => {
        const setIsModalOpenSpy = jest.fn();
        jest
          .spyOn(React, 'useState')
          .mockReturnValueOnce([false, setIsModalOpenSpy]);

        setup({ mode: 'modal' });

        fireEvent.click(screen.getByText('calendar_today'));

        expect(setIsModalOpenSpy).toHaveBeenCalledTimes(1);
        expect(setIsModalOpenSpy).toHaveBeenCalledWith(true);
      });

      test('close modal', () => {
        const setIsModalOpenSpy = jest.fn();
        jest
          .spyOn(React, 'useState')
          .mockReturnValueOnce([true, setIsModalOpenSpy]);

        setup({ mode: 'modal' });

        fireEvent.click(screen.getByText('cancel'));

        expect(setIsModalOpenSpy).toHaveBeenCalledTimes(1);
        expect(setIsModalOpenSpy).toHaveBeenCalledWith(false);
      });

      test('close modal on clicking select button', () => {
        const setIsModalOpenSpy = jest.fn();
        jest
          .spyOn(React, 'useState')
          .mockReturnValueOnce([true, setIsModalOpenSpy]);

        setup({ mode: 'modal' });

        fireEvent.click(screen.getByText('save'));

        expect(setIsModalOpenSpy).toHaveBeenCalledTimes(1);
        expect(setIsModalOpenSpy).toHaveBeenCalledWith(false);
      });
    });

    test('clear button should clear the value', () => {
      const { onChangeSpy } = setup({ value: new Date() });
      fireEvent.click(screen.getByText('close'));
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('');
    });
  });

  describe('DateTimeModal default value', () => {
    it('should open at value date when value is valid date object', () => {
      const value = new Date(1989, 2, 21);
      setup({ value, mode: 'modal' });
      expect(screen.queryByText('March 1989')).toBeInTheDocument();
      expect(screen.getAllByText('21').map((e) => e.className)).toContain(
        'rdtDay rdtActive'
      );
    });

    it('should open at value date when value is valid date string', () => {
      setup({ value: '1989-03-21 13:00:00', mode: 'modal' });
      expect(screen.queryByText('March 1989')).toBeInTheDocument();
      expect(screen.getAllByText('21').map((e) => e.className)).toContain(
        'rdtDay rdtActive'
      );
    });

    it('should open at today when value is invalid date string', () => {
      setup({ value: '2022-42-42 42:42:42', mode: 'modal' });
      const today = new Date();
      expect(
        screen.getAllByText(today.getDate()).map((e) => e.className)
      ).toContain('rdtDay rdtToday');
    });

    it('should open at today when value is incomplete date string', () => {
      setup({ value: '2022-01-__', mode: 'modal' });
      const today = new Date();
      expect(
        screen.getAllByText(today.getDate()).map((e) => e.className)
      ).toContain('rdtDay rdtToday');
    });
  });

  describe('value changes', () => {
    test('becomes filled', () => {
      const value = new Date('1989-02-21T00:00:00.000Z');

      const { props, rerender } = setup({});

      expect(
        screen.getByPlaceholderText('Please enter your date of birth')
      ).toHaveValue('');

      const newProps = {
        ...props,
        value
      };

      rerender(<DateTimeInput color="success" {...newProps} />);

      expect(
        screen.getByPlaceholderText('Please enter your date of birth')
      ).toHaveValue('1989-02-21 00:00:00');
    });
  });
});

describe('Component: JarbDateTimeInput', () => {
  it('should use default validator', async () => {
    expect.assertions(1);

    const isDateValidatorSpy = jest
      .spyOn(Validators, 'isDateValidator')
      .mockReturnValue(jest.fn());
    setConstraints({
      Test: {
        date: {
          required: false,
          javaType: 'String',
          name: 'date'
        }
      }
    });

    await act(() => {
      render(
        <Form onSubmit={jest.fn()}>
          {() => (
            <JarbDateTimeInput
              jarb={{ validator: 'Test.date', label: 'Test' }}
              name="test"
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
            />
          )}
        </Form>
      );
    });

    expect(isDateValidatorSpy).toHaveBeenCalled();
  });
});

describe('Component: FieldDateTimeInput', () => {
  beforeEach(() => {
    setConstraints({
      Test: {
        date: {
          required: false,
          javaType: 'String',
          name: 'date'
        }
      }
    });
  });

  it('should use default validator', async () => {
    expect.assertions(1);

    const isDateValidatorSpy = jest
      .spyOn(Validators, 'isDateValidator')
      .mockReturnValue(jest.fn());

    await act(() => {
      render(
        <Form onSubmit={jest.fn()}>
          {() => (
            <FieldDateTimeInput
              name="test"
              label="Test"
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
            />
          )}
        </Form>
      );
    });

    expect(isDateValidatorSpy).toHaveBeenCalled();
  });

  test('custom label', async () => {
    expect.assertions(0);

    await act(() => {
      render(
        <Form onSubmit={jest.fn()}>
          {() => (
            <FieldDateTimeInput
              name="test"
              label={<Tooltip content="Test">Test</Tooltip>}
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
            />
          )}
        </Form>
      );
    });
  });
});
