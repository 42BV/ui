import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { PlainTextFormControl } from './PlainTextFormControl';

describe('Component: PlainTextFormControl', () => {
  function setup({
    label,
    labelClassName,
    valueClassName
  }: {
    label?: string;
    labelClassName?: string;
    valueClassName?: string;
  }) {
    const props = {
      label,
      labelClassName,
      valueClassName
    };
    const { container } = render(
      <PlainTextFormControl {...props}>This is your name</PlainTextFormControl>
    );
    return { container };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with label', () => {
      setup({
        label: 'Test'
      });
      expect(screen.queryByText('Test')).toBeInTheDocument();
    });

    test('with label class name', () => {
      setup({
        label: 'Test',
        labelClassName: 'label-class-name'
      });
      expect(screen.getByText('Test')).toHaveClass('label-class-name');
    });

    test('with value class name', () => {
      setup({
        valueClassName: 'value-class-name'
      });
      expect(screen.getByText('This is your name')).toHaveClass('value-class-name');
    });
  });
});
