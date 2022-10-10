import React from 'react';
import { render } from '@testing-library/react';
import { RequiredError } from '@42.nl/jarb-final-form';
import * as reactErrorStore from '@42.nl/react-error-store';

import { validMeta } from '../../test/fixtures';
import * as SettledErrors from './useSettledErrors';

import { FormError } from './FormError';

jest.mock('@42.nl/react-error-store');

describe('Component: FormError', () => {
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
      .mockReturnValue(hasBackEndErrors ? [ 'back-end error' ] : []);

    jest
      .spyOn(SettledErrors, 'useSettledErrors')
      .mockReturnValue(hasFrontEndErrors ? [ required ] : []);

    const { container } = render(
      <FormError
        value="henkie"
        meta={validMeta}
        validator="User.name"
        onChange={onChange}
      />
    );

    return { container };
  }

  describe('ui', () => {
    test('both errors', () => {
      const { container } = setup({
        hasFrontEndErrors: true,
        hasBackEndErrors: true
      });

      expect(container).toMatchSnapshot();
    });

    test('no errors', () => {
      const { container } = setup({
        hasFrontEndErrors: false,
        hasBackEndErrors: false
      });

      expect(container.firstChild).toBeNull();
    });

    test('has back-end errors', () => {
      const { container } = setup({
        hasFrontEndErrors: false,
        hasBackEndErrors: true
      });

      expect(container.firstChild).not.toBeNull();
    });

    test('has front-end errors', () => {
      const { container } = setup({
        hasFrontEndErrors: true,
        hasBackEndErrors: false
      });

      expect(container.firstChild).not.toBeNull();
    });
  });
});
