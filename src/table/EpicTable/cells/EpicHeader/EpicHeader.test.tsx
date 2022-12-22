import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { EpicHeader } from './EpicHeader';

describe('Component: EpicHeader', () => {
  describe('ui', () => {
    test('default', () => {
      const { container } = render(
        <EpicHeader width={300} height={44}>
          epic header
        </EpicHeader>
      );
      expect(container).toMatchSnapshot();
    });

    test('with resize', async () => {
      expect.assertions(0);
      render(
        <EpicHeader width={300} height={44} onResize={vi.fn()}>
          epic header
        </EpicHeader>
      );
      await screen.findByTestId('epic-table-header-resize');
    });
  });

  describe('events', () => {
    it('should call onResize with the width when the user resizes', () => {
      const onResizeSpy = vi.fn();

      render(
        <EpicHeader width={300} height={44} onResize={onResizeSpy}>
          epic header
        </EpicHeader>
      );

      fireEvent.mouseDown(screen.getByTestId('epic-table-header-resize'), {
        clientX: 0
      });
      fireEvent.mouseMove(screen.getByTestId('epic-table-header-resize'), {
        clientX: 10
      });
      fireEvent.mouseUp(screen.getByTestId('epic-table-header-resize'));

      expect(onResizeSpy).toBeCalledTimes(1);
      expect(onResizeSpy).toBeCalledWith(310);
    });
  });
});
