import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RequiredError } from '@42.nl/jarb-final-form';
import * as reactErrorStore from '@42.nl/react-error-store';

import { validMeta } from '../../test/fixtures';
import * as SettledErrors from './useSettledErrors';

import FormError from './FormError';

describe('Component: FormError', () => {
  let formError: ShallowWrapper;

  function setup({
    hasFrontEndErrors,
    hasBackEndErrors,
    onChange
  }: {
    hasFrontEndErrors: boolean;
    hasBackEndErrors: boolean;
    onChange?: (hasErrors: boolean) => void;
  }) {
    const required: RequiredError = {
      type: 'ERROR_REQUIRED',
      label: 'Name',
      value: '',
      reasons: {
        required: 'required'
      }
    };

    jest
      .spyOn(reactErrorStore, 'useErrorsForValidator')
      .mockReturnValue(hasBackEndErrors ? ['back-end error'] : []);

    jest
      .spyOn(SettledErrors, 'useSettledErrors')
      .mockReturnValue(hasFrontEndErrors ? [required] : []);

    formError = shallow(
      <FormError
        value="henkie"
        meta={validMeta}
        validator="User.name"
        onChange={onChange}
      />
    );
  }

  describe('ui', () => {
    test('both errors', () => {
      setup({
        hasFrontEndErrors: true,
        hasBackEndErrors: true
      });

      expect(toJson(formError)).toMatchSnapshot(
        'Component: FormError => ui => has both errors'
      );
    });

    test('no errors', () => {
      setup({
        hasFrontEndErrors: false,
        hasBackEndErrors: false
      });

      expect(formError.isEmptyRender()).toBe(true);
    });

    test('has back-end errors', () => {
      setup({
        hasFrontEndErrors: false,
        hasBackEndErrors: true
      });

      expect(toJson(formError)).toMatchSnapshot(
        'Component: FormError => ui => has back-end errors'
      );
    });

    test('has front-end errors', () => {
      setup({
        hasFrontEndErrors: true,
        hasBackEndErrors: false
      });

      expect(toJson(formError)).toMatchSnapshot(
        'Component: FormError => ui => has front-end errors'
      );
    });
  });
});
