import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FormApi } from 'final-form';

import { EpicForm } from './EpicForm';
import { JarbInput } from '../../../../form/Input/Input';

describe('Component: EpicForm', () => {
  function setup({ submitOnChange }: { submitOnChange?: boolean }) {
    const cancelSpy = jest.fn();

    const epicForm = shallow(
      <EpicForm
        id="test"
        width={1950}
        height={52}
        initialValues={{}}
        onSubmit={jest.fn()}
        submitOnChange={submitOnChange}
      >
        <JarbInput
          id="testField"
          name="testField"
          jarb={{ validator: 'Test.test', label: 'Test' }}
        />
      </EpicForm>
    );

    const handleSubmitSpy = jest.fn();

    const formContent = shallow(
      epicForm
        .props()
        .children({ handleSubmit: handleSubmitSpy, form: {} as FormApi })
    );

    return { epicForm, formContent, handleSubmitSpy, cancelSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { epicForm, formContent } = setup({});

      expect(toJson(epicForm)).toMatchSnapshot(
        'Component: EpicForm => ui => epicForm'
      );
      expect(toJson(formContent)).toMatchSnapshot(
        'Component: EpicForm => ui => formContent'
      );
    });

    test('submitOnChange', () => {
      const { formContent } = setup({ submitOnChange: true });

      expect(toJson(formContent)).toMatchSnapshot(
        'Component: EpicForm => ui => submitOnChange'
      );
    });
  });
});
