import React from 'react';
import { render, screen } from '@testing-library/react';

import { InfoTooltip } from './InfoTooltip';
import { Spinner } from '../Spinner/Spinner';

describe('Component: InfoTooltip', () => {
  function setup({
    tooltip = 'tooltip content',
    size,
    className
  }: {
    tooltip?: React.ReactNode;
    size?: number;
    className?: string;
  }) {
    const props = {
      tooltip,
      size,
      className
    };

    const { container } = render(<InfoTooltip {...props} />);

    return { container };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('custom content', () => {
      const { container } = setup({
        tooltip: <Spinner size={10} color="primary" />
      });
      expect(container).toMatchSnapshot();
    });

    test('with size', () => {
      setup({ size: 10 });
      expect(getComputedStyle(screen.getByText('info')).fontSize).toBe('10px');
    });
  });
});
