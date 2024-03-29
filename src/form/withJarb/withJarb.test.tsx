import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactErrorStore from '@42.nl/react-error-store';

import * as useHasErrors from '../../hooks/useHasErrors/useHasErrors';
import { Form } from 'react-final-form';
import { setConstraints } from '@42.nl/jarb-final-form';
import { JarbInput } from '../Input/Input';
import { JarbDateTimeInput } from '../DateTimeInput/DateTimeInput';
import * as Validators from '../DateTimeInput/validators';

jest.mock('@42.nl/react-error-store');

const isSuperman = (value: string) =>
  value === 'superman' ? undefined : 'not superman';

describe('HoC: withJarb', () => {
  function setup({ hasErrors = false, hasBackEndErrors = false, errorMode }: { hasErrors?: boolean; hasBackEndErrors?: boolean; errorMode?: 'tooltip' | 'below' }) {
    jest
      .spyOn(useHasErrors, 'useHasErrors')
      .mockImplementation(() => [ hasErrors, jest.fn() ]);
    jest
      .spyOn(reactErrorStore, 'useErrorsForValidator')
      .mockReturnValue(hasBackEndErrors ? [ 'back-end error' ] : []);

    setConstraints({
      User: {
        firstName: {
          javaType: 'String',
          name: 'firstName'
        }
      }
    });

    const { container, asFragment } = render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <JarbInput
            name="firstName"
            jarb={{ validator: 'User.firstName', label: 'First name' }}
            validators={[ isSuperman ]}
            asyncValidators={[ isSuperman ]}
            asyncValidatorsDebounce={100}
            id="firstName"
            label="First name"
            placeholder="Please enter your first name"
            // Should pass `passedFieldProps`
            initialValue="beheer@42.nl"
            format={() => 'yolo'}
            formatOnBlur={false}
            parse={() => 'oloy'}
            errorMode={errorMode}
          />
        )}
      </Form>
    );

    return { container, asFragment };
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ui', () => {
    test('default', async () => {
      expect.assertions(1);
      const { container } = setup({});
      await act(() => {
        jest.runAllTimers();
      });
      expect(container).toMatchSnapshot();
    });

    test('with error', async () => {
      expect.assertions(2);
      const { asFragment } = setup({ hasErrors: true });
      await act(() => {
        fireEvent.focus(screen.getByRole('textbox'));
        fireEvent.blur(screen.getByRole('textbox'));
        jest.runAllTimers();
      });
      await waitFor(() => {
        expect(screen.queryByText('not superman')).toBeInTheDocument();
      });
      expect(asFragment()).toMatchSnapshot();
    });
  });

  test('errorMode: tooltip', async () => {
    expect.assertions(1);
    const { container } = setup({ hasErrors: true, errorMode: 'tooltip' });
    await act(() => {
      jest.runAllTimers();
    });
    // Just ensure the tooltip div exists, because testing the tooltip is tested by itself
    expect(container).toMatchSnapshot();
  });

  test('defaultValidators', async () => {
    expect.assertions(2);

    jest
      .spyOn(reactErrorStore, 'useErrorsForValidator')
      .mockReturnValue([]);
    const isDateValidatorSpy = jest.fn();
    jest.spyOn(Validators, 'isDateValidator').mockReturnValue(isDateValidatorSpy);
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
    setConstraints({
      Test: {
        date: {
          required: false,
          javaType: 'String',
          name: 'date'
        }
      }
    });

    render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <JarbDateTimeInput jarb={{ validator: 'Test.date', label: 'test' }} name="test" dateFormat="YYYY-MM-DD" timeFormat={false} />
        )}
      </Form>
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4242-42-42' } });
    await act(() => {
      jest.runAllTimers();
    });

    expect(isDateValidatorSpy).toHaveBeenCalled();
    expect(isDateValidatorSpy).toHaveBeenLastCalledWith(
      '4242-42-42',
      expect.objectContaining({ test: '4242-42-42' }),
      expect.objectContaining({ active: false })
    );
  });

  it('should throw an error when detecting illegal props', () => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    expect(() =>
      // @ts-expect-error Test mock
      render(<JarbInput value="test" onChange={() => undefined} />)
    ).toThrowErrorMatchingSnapshot();
  });

  describe('events', () => {
    test('onChange: remove back-end errors', async () => {
      expect.assertions(2);

      setup({ hasBackEndErrors: true });

      jest.spyOn(reactErrorStore, 'clearErrorsForValidator');

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '42' } });

      await act(() => {
        jest.runAllTimers();
      });

      expect(reactErrorStore.clearErrorsForValidator).toHaveBeenCalledTimes(1);
      expect(reactErrorStore.clearErrorsForValidator).toHaveBeenCalledWith('User.firstName');
    });
  });
});
