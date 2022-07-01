import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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

    test('with resize', () => {
      render(
        <EpicHeader width={300} height={44} onResize={jest.fn()}>
          epic header
        </EpicHeader>
      );
      expect(screen.queryByTestId('epic-table-header-resize')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should call onResize with the width when the user resizes', () => {
      const onResizeSpy = jest.fn();

      render(
        <EpicHeader width={300} height={44} onResize={onResizeSpy}>
          epic header
        </EpicHeader>
      );

      fireEvent.mouseDown(screen.getByTestId('epic-table-header-resize'), { clientX: 0 });
      fireEvent.mouseMove(screen.getByTestId('epic-table-header-resize'), { clientX: 10 });
      fireEvent.mouseUp(screen.getByTestId('epic-table-header-resize'));

      expect(onResizeSpy).toBeCalledTimes(1);
      expect(onResizeSpy).toBeCalledWith(310);
    });
  });
});
