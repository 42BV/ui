import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EpicCell } from './EpicCell';

describe('Component: EpicCell', () => {
  function setup({
    hasOnRowClick = true,
    height
  }: {
    hasOnRowClick?: boolean;
    height?: number;
  }) {
    const onRowClickSpy = jest.fn();
    const onHoverChangedSpy = jest.fn();

    const { container } = render(
      <EpicCell
        width={300}
        height={height}
        // @ts-expect-error Test mock
        onRowClick={hasOnRowClick ? onRowClickSpy : undefined}
        onHoverChanged={hasOnRowClick ? onHoverChangedSpy : undefined}
      >
        epic cell
      </EpicCell>
    );

    return { container, onRowClickSpy, onHoverChangedSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with height', () => {
      const { container } = setup({ height: 50 });
      expect(container.firstChild).toHaveStyle({ height: '50px' });
    });
  });

  describe('events', () => {
    it('should call onRowClick when the div is clicked', () => {
      const { onRowClickSpy } = setup({});

      fireEvent.click(screen.getByText('epic cell'));

      expect(onRowClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onHoverChanged when hovering over the div', () => {
      const { onHoverChangedSpy } = setup({});

      fireEvent.mouseEnter(screen.getByText('epic cell'));

      expect(onHoverChangedSpy).toHaveBeenCalledTimes(1);
      expect(onHoverChangedSpy).toHaveBeenCalledWith(true);

      fireEvent.mouseLeave(screen.getByText('epic cell'));

      expect(onHoverChangedSpy).toHaveBeenCalledTimes(2);
      expect(onHoverChangedSpy).toHaveBeenCalledWith(false);
    });
  });
});
