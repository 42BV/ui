import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalPickerOpener } from './ModalPickerOpener';
import { adminUser } from '../../../test/fixtures';
import { ModalPickerButtonAlignment } from '../types';

describe('Component: ModalPickerOpener', () => {
  function setup({
    hasValue = false,
    hasIcon = false,
    alignButton
  }: {
    hasValue?: boolean;
    hasIcon?: boolean;
    alignButton?: ModalPickerButtonAlignment;
  }) {
    const openModalSpy = vi.fn();
    const onClearSpy = vi.fn();

    const value = hasValue ? adminUser().email : undefined;
    const icon = hasIcon ? 'face' : undefined;

    const { container } = render(
      <ModalPickerOpener
        openModal={openModalSpy}
        label="Best friend"
        icon={icon}
        value={value}
        onClear={onClearSpy}
        alignButton={alignButton}
        renderValue={(value: string) =>
          value ? <span>{value.toUpperCase()}</span> : null
        }
      />
    );

    return { container, openModalSpy, onClearSpy };
  }

  describe('ui', () => {
    test('without values', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with values', () => {
      const { container } = setup({ hasValue: true });
      expect(container).toMatchSnapshot();
    });

    test('with icon', async () => {
      expect.assertions(0);
      setup({ hasIcon: true });
      await screen.findByText('face');
    });

    test('button aligned right without values', () => {
      const { container } = setup({ alignButton: 'right' });
      expect(
        // @ts-expect-error HTMLElement has property classList
        container.firstChild.classList.contains('justify-content-end')
      ).toBe(true);
    });

    test('button aligned right with values', () => {
      const { container } = setup({ hasValue: true, alignButton: 'right' });
      expect(
        // @ts-expect-error HTMLElement has property classList
        container.firstChild.classList.contains('justify-content-between')
      ).toBe(true);
    });

    test('button aligned left without values', () => {
      const { container } = setup({ alignButton: 'left' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('flex-row-reverse')).toBe(
        true
      );
      expect(
        // @ts-expect-error HTMLElement has property classList
        container.firstChild.classList.contains('justify-content-end')
      ).toBe(true);
    });

    test('button aligned left with values', () => {
      const { container } = setup({ hasValue: true, alignButton: 'left' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('flex-row-reverse')).toBe(
        true
      );
      expect(
        // @ts-expect-error HTMLElement has property classList
        container.firstChild.classList.contains('justify-content-end')
      ).toBe(true);
    });
  });

  describe('events', () => {
    it('should open the modal when the select button is clicked', () => {
      const { openModalSpy } = setup({});

      fireEvent.click(screen.getByText('Best friend'));

      expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onClear when the clear button is clicked', () => {
      const { onClearSpy } = setup({ hasValue: true });

      fireEvent.click(screen.getByText('Clear'));

      expect(onClearSpy).toHaveBeenCalledTimes(1);
    });
  });
});
