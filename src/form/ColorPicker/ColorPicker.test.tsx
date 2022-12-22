import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ColorPicker } from './ColorPicker';
import { Color } from '../../core/types';
import { IconType } from '../../core/Icon';

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
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

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
      color: 'success' as Color,
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

    test('with icon', async () => {
      expect.assertions(0);
      setup({ hasIcon: true });
      await screen.findByText('face');
    });

    test('without icon', () => {
      setup({ hasIcon: false });
      expect(screen.queryByText('face')).toBeNull();
    });

    test('visible label', async () => {
      expect.assertions(0);
      setup({ hasLabel: true });
      await screen.findByText('Best Friend');
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Best Friend')).toBeNull();
    });

    test('with clear button', async () => {
      expect.assertions(0);
      setup({ value: '#cdcdcd', canClear: true });
      await screen.findByText('Clear');
    });

    test('without clear button', () => {
      setup({ value: '#cdcdcd', canClear: false });
      expect(screen.queryByText('Clear')).toBeNull();
    });
  });

  describe('events', () => {
    async function expectPopoverOpen(open: boolean) {
      if (open) {
        await screen.findByText('Cancel');
        await screen.findByText('Select');
        await screen.findByLabelText('hex');
        await screen.findByLabelText('r');
        await screen.findByLabelText('g');
        await screen.findByLabelText('b');
        await screen.findByLabelText('a');
      } else {
        expect(screen.queryByText('Cancel')).toBeNull();
        expect(screen.queryByText('Select')).toBeNull();
        expect(screen.queryByLabelText('hex')).toBeNull();
        expect(screen.queryByLabelText('r')).toBeNull();
        expect(screen.queryByLabelText('g')).toBeNull();
        expect(screen.queryByLabelText('b')).toBeNull();
        expect(screen.queryByLabelText('a')).toBeNull();
      }
    }

    it('should open the popover when the select button is clicked', async () => {
      expect.assertions(7);

      setup({
        value: undefined
      });

      await expectPopoverOpen(false);

      fireEvent.click(screen.getByText('Select your best friend'));

      await expectPopoverOpen(true);
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
      it('should not call onChange when cancelled when a previous value has been selected', async () => {
        expect.assertions(2);

        const { onChangeSpy, onBlurSpy } = setup({
          value: '#cdcdcd'
        });

        fireEvent.click(screen.getByText('Select your best friend'));

        await expectPopoverOpen(true);

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
