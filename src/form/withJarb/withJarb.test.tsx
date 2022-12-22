import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import * as reactErrorStore from '@42.nl/react-error-store';

import * as useHasErrors from '../../hooks/useHasErrors/useHasErrors';
import { Form } from 'react-final-form';
import { setConstraints } from '@42.nl/jarb-final-form';
import { JarbInput } from '../Input/Input';
import { JarbDateTimeInput } from '../DateTimeInput/DateTimeInput';
import * as Validators from '../DateTimeInput/validators';

vi.mock('@42.nl/react-error-store');

const isSuperman = (value: string) =>
  value === 'superman' ? undefined : 'not superman';

describe.skip('HoC: withJarb', () => {
  function setup({
    hasErrors = false,
    hasBackEndErrors = false,
    errorMode
  }: {
    hasErrors?: boolean;
    hasBackEndErrors?: boolean;
    errorMode?: 'tooltip' | 'below';
  }) {
    vi.spyOn(useHasErrors, 'useHasErrors').mockImplementation(() => [
      hasErrors,
      vi.fn()
    ]);
    vi.spyOn(reactErrorStore, 'useErrorsForValidator').mockReturnValue(
      hasBackEndErrors ? ['back-end error'] : []
    );

    setConstraints({
      User: {
        firstName: {
          javaType: 'String',
          name: 'firstName'
        }
      }
    });

    const { container, asFragment } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <JarbInput
            name="firstName"
            jarb={{ validator: 'User.firstName', label: 'First name' }}
            validators={[isSuperman]}
            asyncValidators={[isSuperman]}
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ui', () => {
    test('default', async () => {
      expect.assertions(1);
      const { container } = setup({});
      await act(() => {
        vi.runAllTimers();
      });
      expect(container).toMatchSnapshot();
    });

    test('with error', async () => {
      expect.assertions(1);
      const { asFragment } = setup({ hasErrors: true });
      await act(() => {
        fireEvent.focus(screen.getByRole('textbox'));
        fireEvent.blur(screen.getByRole('textbox'));
        vi.runAllTimers();
      });
      await screen.findByText('not superman');
      expect(asFragment()).toMatchSnapshot();
    });
  });

  test('errorMode: tooltip', async () => {
    expect.assertions(1);
    const { container } = setup({ hasErrors: true, errorMode: 'tooltip' });
    await act(() => {
      vi.runAllTimers();
    });
    // Just ensure the tooltip div exists, because testing the tooltip is tested by itself
    expect(container).toMatchSnapshot();
  });

  test('defaultValidators', async () => {
    expect.assertions(2);

    vi.spyOn(reactErrorStore, 'useErrorsForValidator').mockReturnValue([]);
    const isDateValidatorSpy = vi.fn();
    vi.spyOn(Validators, 'isDateValidator').mockReturnValue(isDateValidatorSpy);
    vi.spyOn(console, 'warn').mockImplementation(vi.fn());
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
      <Form onSubmit={() => undefined}>
        {() => (
          <JarbDateTimeInput
            jarb={{ validator: 'Test.date', label: 'test' }}
            name="test"
            dateFormat="YYYY-MM-DD"
            timeFormat={false}
          />
        )}
      </Form>
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '4242-42-42' }
    });
    await act(() => {
      vi.runAllTimers();
    });

    expect(isDateValidatorSpy).toHaveBeenCalled();
    expect(isDateValidatorSpy).toHaveBeenLastCalledWith(
      '4242-42-42',
      expect.objectContaining({ test: '4242-42-42' }),
      expect.objectContaining({ active: false })
    );
  });

  it('should throw an error when detecting illegal props', () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
    expect(() =>
      // @ts-expect-error Test mock
      render(<JarbInput value="test" onChange={() => undefined} />)
    ).toThrowErrorMatchingSnapshot();
  });

  describe('events', () => {
    test('onChange: remove back-end errors', async () => {
      expect.assertions(2);

      setup({ hasBackEndErrors: true });

      vi.spyOn(reactErrorStore, 'clearErrorsForValidator');

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '42' }
      });

      await act(() => {
        vi.runAllTimers();
      });

      expect(reactErrorStore.clearErrorsForValidator).toHaveBeenCalledTimes(1);
      expect(reactErrorStore.clearErrorsForValidator).toHaveBeenCalledWith(
        'User.firstName'
      );
    });
  });
});
