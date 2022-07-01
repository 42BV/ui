import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    const openModalSpy = jest.fn();
    const onClearSpy = jest.fn();

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

    test('with icon', () => {
      setup({ hasIcon: true });
      expect(screen.getByText('face')).toBeInTheDocument();
    });

    test('button aligned right without values', () => {
      const { container } = setup({ alignButton: 'right' });
      expect(container.firstChild).toHaveClass('justify-content-end');
    });

    test('button aligned right with values', () => {
      const { container } = setup({ hasValue: true, alignButton: 'right' });
      expect(container.firstChild).toHaveClass('justify-content-between');
    });

    test('button aligned left without values', () => {
      const { container } = setup({ alignButton: 'left' });
      expect(container.firstChild).toHaveClass('flex-row-reverse');
      expect(container.firstChild).toHaveClass('justify-content-end');
    });

    test('button aligned left with values', () => {
      const { container } = setup({ hasValue: true, alignButton: 'left' });
      expect(container.firstChild).toHaveClass('flex-row-reverse');
      expect(container.firstChild).toHaveClass('justify-content-end');
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
