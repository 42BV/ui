import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EpicSelection } from './EpicSelection';

describe('Component: EpicSelection', () => {
  function setup({ checked }: { checked: boolean }) {
    const onChangeSpy = jest.fn();

    const { container } = render(
      <EpicSelection onChange={onChangeSpy} checked={checked} />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('is checked', () => {
      const { container } = setup({ checked: true });
      expect(container).toMatchSnapshot();
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('is not checked', () => {
      setup({ checked: false });
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('events', () => {
    it('should call onChange with true when checkbox is clicked while not checked', () => {
      const { onChangeSpy } = setup({ checked: false });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when checkbox is clicked while checked', () => {
      const { onChangeSpy } = setup({ checked: true });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);
    });
  });
});
