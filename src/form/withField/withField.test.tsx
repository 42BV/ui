import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';

import * as useHasErrors from '../../hooks/useHasErrors/useHasErrors';
import { Form } from 'react-final-form';
import { setConstraints } from '@42.nl/jarb-final-form';
import { FieldInput } from '../Input/Input';
import { FieldDateTimeInput } from '../DateTimeInput/DateTimeInput';
import * as Validators from '../DateTimeInput/validators';

const isSuperman = (value: string) =>
  value === 'superman' ? undefined : 'not superman';

describe('HoC: withField', () => {
  function setup({
    hasErrors = false,
    errorMode
  }: {
    hasErrors?: boolean;
    errorMode?: 'tooltip' | 'below';
  }) {
    jest
      .spyOn(useHasErrors, 'useHasErrors')
      .mockImplementation(() => [hasErrors, jest.fn()]);

    const { container, asFragment } = render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <FieldInput
            name="firstName"
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

    const isDateValidatorSpy = jest.fn();
    jest
      .spyOn(Validators, 'isDateValidator')
      .mockReturnValue(isDateValidatorSpy);
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
          <FieldDateTimeInput
            label="Test"
            name="test"
            dateFormat="yyyy-MM-dd"
            timeFormat={false}
          />
        )}
      </Form>
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '4242-42-42' }
    });
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
      render(<FieldInput value="test" onChange={() => undefined} />)
    ).toThrowErrorMatchingSnapshot();
  });
});
