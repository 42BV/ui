import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Toggle } from './Toggle';
import { Tooltip } from '../Tooltip/Tooltip';
import { ReactNode } from 'react';

describe('Component: Toggle', () => {
  function setup({
    value,
    label = 'Test',
    hasLabel
  }: {
    value?: boolean;
    label?: ReactNode;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      id: hasLabel ? 'toggle' : undefined,
      label,
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(
      <Toggle {...props} color="primary" />
    );

    return { container, rerender, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('checked', () => {
      setup({ value: true });
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('with text label', () => {
      const { container } = setup({ value: false, hasLabel: true });
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByLabelText('Test')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('with custom label', () => {
      const label = <Tooltip content="Is this a test?">test</Tooltip>;
      const { container } = setup({ value: false, label });
      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      it('should call onChange with true when unchecked', () => {
        const { onChangeSpy } = setup({ value: false });

        expect(screen.getByRole('checkbox')).not.toBeChecked();

        fireEvent.click(screen.getByRole('checkbox'));

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(true);
      });

      it('should call onChange with false when checked', () => {
        const { onChangeSpy } = setup({ value: true });

        expect(screen.getByRole('checkbox')).toBeChecked();

        fireEvent.click(screen.getByRole('checkbox'));

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(false);
      });
    });

    test('onBlur', () => {
      const { onBlurSpy } = setup({});

      fireEvent.blur(screen.getByRole('checkbox'));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onChange when label is clicked', () => {
      const { onChangeSpy } = setup({ hasLabel: true });

      fireEvent.click(screen.getByText('Test'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });
  });

  test('value changes', () => {
    const onChange = jest.fn();

    const { rerender } = render(
      <Toggle
        id="toggle"
        label="toggle"
        color="primary"
        value={false}
        onChange={onChange}
      />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(
      <Toggle
        id="toggle"
        label="toggle"
        color="primary"
        value={true}
        onChange={onChange}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
