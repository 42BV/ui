import React from 'react';
import { CheckBox } from './CheckBox';
import { render } from '@testing-library/react';

describe('Component: CheckBox', () => {
  function setup({
    id,
    checked = false,
    label,
    hiddenLabel
  }: {
    id: string;
    checked: boolean;
    label: string;
    hiddenLabel?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      id,
      onChange: onChangeSpy,
      checked,
      onBlur: onBlurSpy,
      ariaLabel: hiddenLabel && typeof label === 'string' ? label : undefined
    };

    const { container, rerender } = render(<CheckBox {...props} />);

    return { container, rerender, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({
        id: '1',
        checked: false,
        label: 'Test',
        hiddenLabel: true
      });
      expect(container).toMatchSnapshot();
    });
  });
});
