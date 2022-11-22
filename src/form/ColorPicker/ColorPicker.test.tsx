import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ColorPicker } from './ColorPicker';
import { BootstrapColor, IconType } from '../../core/types';

describe('Component: ColorPicker', () => {
  function setup({
    value,
    hasIcon,
    canClear,
    hasLabel
  }: {
    value?: string;
    hasIcon?: boolean;
    canClear?: boolean;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      id: hasLabel ? 'bestFriend' : undefined,
      hiddenLabel: !hasLabel,
      name: 'bestFriend',
      label: 'Best Friend',
      placeholder: 'Select your best friend',
      icon: hasIcon ? ('face' as IconType) : undefined,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      color: 'success' as BootstrapColor,
      canClear
    };

    const { container, asFragment, rerender } = render(
      <ColorPicker {...props} />
    );

    return { container, props, rerender, asFragment, onBlurSpy, onChangeSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('open', () => {
      const { asFragment } = setup({});

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(asFragment()).toMatchSnapshot();
    });

    test('with selected value', () => {
      const { container } = setup({ value: '#cdcdcd' });
      expect(container).toMatchSnapshot();
    });

    test('with icon', () => {
      setup({ hasIcon: true });
      expect(screen.queryByText('face')).toBeInTheDocument();
    });

    test('without icon', () => {
      setup({ hasIcon: false });
      expect(screen.queryByText('face')).not.toBeInTheDocument();
    });

    test('visible label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('Best Friend')).toBeInTheDocument();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Best Friend')).not.toBeInTheDocument();
    });

    test('with clear button', () => {
      setup({ value: '#cdcdcd', canClear: true });
      expect(screen.queryByText('Clear')).toBeInTheDocument();
    });

    test('without clear button', () => {
      setup({ value: '#cdcdcd', canClear: false });
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    function expectPopoverOpen(open: boolean) {
      if (open) {
        expect(screen.queryByText('Cancel')).toBeInTheDocument();
        expect(screen.queryByText('Select')).toBeInTheDocument();
        expect(screen.queryByLabelText('hex')).toBeInTheDocument();
        expect(screen.queryByLabelText('r')).toBeInTheDocument();
        expect(screen.queryByLabelText('g')).toBeInTheDocument();
        expect(screen.queryByLabelText('b')).toBeInTheDocument();
        expect(screen.queryByLabelText('a')).toBeInTheDocument();
      } else {
        expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
        expect(screen.queryByText('Select')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('hex')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('r')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('g')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('b')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('a')).not.toBeInTheDocument();
      }
    }

    it('should open the popover when the select button is clicked', () => {
      setup({
        value: undefined
      });

      expectPopoverOpen(false);

      fireEvent.click(screen.getByText('Select your best friend'));

      expectPopoverOpen(true);
    });

    it('should call onChange when the user selects a color', () => {
      const { onChangeSpy, onBlurSpy } = setup({
        value: '#cdcdcd'
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      // @ts-expect-error saturation-black will always return element
      fireEvent.touchStart(document.querySelector('.saturation-black'), {
        touches: [{ pageX: 20, pageY: 20 }]
      });
      // @ts-expect-error saturation-black will always return element
      fireEvent.touchEnd(document.querySelector('.saturation-black'), {
        touches: [{ pageX: 20, pageY: 20 }]
      });

      fireEvent.click(screen.getByText('Select'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('#000000');

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    describe('cancel behavior', () => {
      it('should not call onChange when cancelled when a previous value has been selected', () => {
        const { onChangeSpy, onBlurSpy } = setup({
          value: '#cdcdcd'
        });

        fireEvent.click(screen.getByText('Select your best friend'));

        expectPopoverOpen(true);

        fireEvent.click(screen.getByText('Cancel'));

        expect(onChangeSpy).toHaveBeenCalledTimes(0);
        expect(onBlurSpy).toHaveBeenCalledTimes(0);
      });

      it('should not call onChange when cancelled when a previous value was not selected', () => {
        const { onChangeSpy, onBlurSpy } = setup({
          value: undefined
        });

        fireEvent.click(screen.getByText('Select your best friend'));
        fireEvent.click(screen.getByText('Cancel'));

        expect(onChangeSpy).toHaveBeenCalledTimes(0);
        expect(onBlurSpy).toHaveBeenCalledTimes(0);
      });
    });

    it('should when the user clicks "clear" reset the color', () => {
      const { onBlurSpy, onChangeSpy } = setup({
        value: '#cdcdcd'
      });

      fireEvent.click(screen.getByText('Clear'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { container, props, rerender, asFragment } = setup({
        value: '#cdcdcd'
      });

      expect(container).toMatchSnapshot('with value');

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<ColorPicker {...newProps} />);

      expect(asFragment()).toMatchSnapshot('without value');
    });

    test('becomes filled', () => {
      const { container, props, rerender, asFragment } = setup({
        value: undefined
      });

      expect(container).toMatchSnapshot('without value');

      const newProps = {
        ...props,
        value: '#424242'
      };

      rerender(<ColorPicker {...newProps} />);

      expect(asFragment()).toMatchSnapshot('with value');
    });
  });
});
