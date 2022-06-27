import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalPickerValueTruncator } from './ModalPickerValueTruncator';
import { adminUser, userUser } from '../../../test/fixtures';
import * as ComponentOverflow from './useComponentOverflow/useComponentOverflow';

describe('Component: ModalPickerValueTruncator', () => {
  function setup({
    hasSingleValue = false,
    hasMultipleValues = false
  }: {
    hasSingleValue?: boolean;
    hasMultipleValues?: boolean;
  }) {
    const labelForOptionSpy = jest.fn((user) => user.email);

    const value = hasSingleValue
      ? userUser()
      : hasMultipleValues
        ? [ adminUser(), userUser() ]
        : undefined;

    const { container } = render(
      <ModalPickerValueTruncator
        value={value}
        labelForOption={labelForOptionSpy}
      />
    );

    return { container, labelForOptionSpy };
  }

  describe('ui', () => {
    test('no value', () => {
      const { container } = setup({});
      expect(container.firstChild).toBeNull();
    });

    test('single value', () => {
      const { container } = setup({ hasSingleValue: true });
      expect(container).toMatchSnapshot();
    });

    test('mutliple values', () => {
      setup({ hasMultipleValues: true });
      expect(screen.getByText('admin@42.nl, user@42.nl')).toBeInTheDocument();
    });

    test('overflowing', () => {
      jest
        .spyOn(ComponentOverflow, 'useComponentOverflow')
        .mockReturnValue(true);
      const { container } = setup({ hasMultipleValues: true });
      expect(container).toMatchSnapshot();
    });
  });
});
