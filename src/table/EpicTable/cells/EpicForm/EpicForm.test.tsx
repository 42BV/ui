import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';

import { EpicForm } from './EpicForm';
import { FieldInput } from '../../../../form/Input/Input';
import userEvent from '@testing-library/user-event';
import { setConstraints } from '@42.nl/jarb-final-form';

describe('Component: EpicForm', () => {
  function setup({ submitOnChange }: { submitOnChange?: boolean }) {
    setConstraints({
      Test: {
        test: {
          javaType: 'String',
          name: 'test',
          required: true
        }
      }
    });

    const onSubmitSpy = jest.fn();

    const { container } = render(
      <EpicForm
        id="test"
        width={1950}
        height={52}
        initialValues={{}}
        onSubmit={onSubmitSpy}
        submitOnChange={submitOnChange}
      >
        <FieldInput id="testField" name="testField" label="Test" />
        <button type="reset">Reset</button>
      </EpicForm>
    );

    return { container, onSubmitSpy };
  }

  test('ui', async () => {
    expect.assertions(1);
    const { container } = setup({});
    await act(() => {
      fireEvent.focus(screen.getByRole('textbox'));
    });
    expect(container).toMatchSnapshot();
  });

  describe('events', () => {
    it('should call submit on changes when submitOnChange is true', async () => {
      expect.assertions(2);

      const { onSubmitSpy } = setup({ submitOnChange: true });

      fireEvent.focus(screen.getByRole('textbox'));
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test' }
      });
      fireEvent.blur(screen.getByRole('textbox'));

      await waitFor(() => {
        expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should when resetting the form call reset on the the react-final-form Form', async () => {
      expect.assertions(1);

      setup({});

      await userEvent.type(screen.getByLabelText('Test'), 'test');
      await act(() => {
        fireEvent.click(screen.getByText('Reset'));
      });

      expect(screen.getByLabelText('Test')).toHaveValue('');
    });
  });
});
