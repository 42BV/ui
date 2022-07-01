import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Toggle from './Toggle';
import Tooltip from '../Tooltip/Tooltip';

describe('Component: Toggle', () => {
  function setup({
    value,
    label
  }: {
    value?: boolean;
    label?: React.ReactNode;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const { container, rerender } = render(
      <Toggle
        id="toggle"
        color="primary"
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        label={label}
      />
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
      const { container } = setup({ value: false, label: 'test' });
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByLabelText('test')).toBeInTheDocument();
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
      const { onChangeSpy } = setup({ label: 'Test' });

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
        color="primary"
        value={false}
        onChange={onChange}
      />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(
      <Toggle
        id="toggle"
        color="primary"
        value={true}
        onChange={onChange}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
