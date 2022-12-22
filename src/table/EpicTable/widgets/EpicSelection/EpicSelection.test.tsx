import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { EpicSelection } from './EpicSelection';

describe('Component: EpicSelection', () => {
  function setup({ checked }: { checked: boolean }) {
    const onChangeSpy = vi.fn();

    const { container } = render(
      <EpicSelection onChange={onChangeSpy} checked={checked} />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('is checked', () => {
      const { container } = setup({ checked: true });
      expect(container).toMatchSnapshot();
      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });

    test('is not checked', () => {
      setup({ checked: false });
      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(false);
    });
  });

  describe('events', () => {
    it('should call onChange with true when checkbox is clicked while not checked', () => {
      const { onChangeSpy } = setup({ checked: false });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(true);
    });

    it('should call onChange with false when checkbox is clicked while checked', () => {
      const { onChangeSpy } = setup({ checked: true });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(false);
    });
  });
});
