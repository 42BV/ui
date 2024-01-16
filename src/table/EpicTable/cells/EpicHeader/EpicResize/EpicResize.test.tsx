import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { EpicResize } from './EpicResize';

describe('Component: EpicResize', () => {
  test('ui', () => {
    const { container } = render(
      <EpicResize width={300} onResize={jest.fn()} />
    );

    expect(container).toMatchSnapshot();
  });

  describe('events', () => {
    it('should resize with a throttle', () => {
      const onResizeSpy = jest.fn();

      render(<EpicResize width={300} onResize={onResizeSpy} />);

      fireEvent.mouseDown(screen.getByTestId('epic-table-header-resize'), {
        clientX: 0
      });

      expect(document.body.style.cursor).toBe('col-resize');
      expect(document.body.classList.contains('user-select-none')).toBe(true);

      fireEvent.mouseMove(screen.getByTestId('epic-table-header-resize'), {
        clientX: 42
      });

      expect(onResizeSpy).toHaveBeenCalledTimes(1);
      expect(onResizeSpy).toHaveBeenCalledWith(342);

      fireEvent.mouseMove(screen.getByTestId('epic-table-header-resize'), {
        clientX: 80
      });

      expect(onResizeSpy).toHaveBeenCalledTimes(1);

      fireEvent.mouseUp(screen.getByTestId('epic-table-header-resize'));

      expect(document.body.style.cursor).toBe('default');
      expect(document.body.classList.contains('user-select-none')).toBe(false);
    });

    it('should when onResize changes update the throttle', () => {
      const oldResizeSpy = jest.fn();

      const { rerender } = render(
        <EpicResize width={300} onResize={oldResizeSpy} />
      );

      fireEvent.mouseDown(screen.getByTestId('epic-table-header-resize'), {
        clientX: 0
      });
      fireEvent.mouseMove(screen.getByTestId('epic-table-header-resize'), {
        clientX: 42
      });

      expect(oldResizeSpy).toHaveBeenCalledTimes(1);

      const newResizeSpy = jest.fn();

      rerender(<EpicResize width={300} onResize={newResizeSpy} />);

      fireEvent.mouseMove(screen.getByTestId('epic-table-header-resize'), {
        clientX: 42
      });

      // The old one should not be called again
      expect(oldResizeSpy).toHaveBeenCalledTimes(1);

      // The new should be called instead
      expect(newResizeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not allow resizing to below the initial width', () => {
      const onResizeSpy = jest.fn();

      render(<EpicResize width={300} onResize={onResizeSpy} />);

      fireEvent.mouseDown(screen.getByTestId('epic-table-header-resize'), {
        clientX: 300
      });

      expect(document.body.style.cursor).toBe('col-resize');
      expect(document.body.classList.contains('user-select-none')).toBe(true);

      fireEvent.mouseMove(screen.getByTestId('epic-table-header-resize'), {
        clientX: 280
      });

      expect(onResizeSpy).toHaveBeenCalledTimes(1);
      expect(onResizeSpy).toHaveBeenCalledWith(300);
    });
  });
});
