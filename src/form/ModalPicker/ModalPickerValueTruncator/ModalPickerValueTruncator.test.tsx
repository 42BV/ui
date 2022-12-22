import React from 'react';
import { render, screen } from '@testing-library/react';
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
    const labelForOptionSpy = vi.fn((user) => user.email);

    const value = hasSingleValue
      ? userUser()
      : hasMultipleValues
      ? [adminUser(), userUser()]
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

    test('multiple values', async () => {
      expect.assertions(0);
      setup({ hasMultipleValues: true });
      await screen.findByText('admin@42.nl, user@42.nl');
    });

    test('overflowing', () => {
      vi.spyOn(ComponentOverflow, 'useComponentOverflow').mockReturnValue(true);
      const { container } = setup({ hasMultipleValues: true });
      expect(container).toMatchSnapshot();
    });
  });
});
