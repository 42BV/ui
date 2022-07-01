import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EpicForm } from './EpicForm';
import { JarbInput } from '../../../../form/Input/Input';
import userEvent from '@testing-library/user-event';
import { setConstraints } from '@42.nl/jarb-final-form';

describe('Component: EpicForm', () => {
  function setup({ submitOnChange }: { submitOnChange?: boolean }) {
    setConstraints({
      Test: {
        test: {
          javaType: 'String',
          name: 'test'
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
        <JarbInput
          id="testField"
          name="testField"
          label="test"
          jarb={{ validator: 'Test.test', label: 'Test' }}
        />
      </EpicForm>
    );

    return { container, onSubmitSpy };
  }

  test('ui', () => {
    const { container } = setup({});
    expect(container).toMatchSnapshot();
  });

  describe('events', () => {
    it('should call submit on changes when submitOnChange is true', () => {
      const { onSubmitSpy } = setup({ submitOnChange: true });
      fireEvent.focus(screen.getByRole('textbox'));
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
      fireEvent.blur(screen.getByRole('textbox'));
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should when resetting the form call reset on the the react-final-form Form', async () => {
      expect.assertions(1);

      setup({});

      await userEvent.type(screen.getByLabelText('test'), 'test');
      fireEvent.reset(screen.getByTestId('epicform-form'));

      expect(screen.getByLabelText('test')).toHaveValue('');
    });
  });
});
