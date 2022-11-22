import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Tooltip } from './Tooltip';
import userEvent from '@testing-library/user-event';

describe('Component: Tooltip', () => {
  describe('ui', () => {
    test('default', async () => {
      expect.assertions(1);

      const { container } = render(
        <Tooltip content="Tooltip Content">
          The tooltip should be wrapped around this
        </Tooltip>
      );

      await userEvent.hover(
        screen.getByText('The tooltip should be wrapped around this')
      );

      expect(container).toMatchSnapshot();
    });

    test('with custom tag', () => {
      const { container } = render(
        <Tooltip tag="div" content="Tooltip content">
          The tooltip should be wrapped around this
        </Tooltip>
      );
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    test('with custom content', async () => {
      expect.assertions(1);

      render(
        <Tooltip content={<span>Tooltip content</span>}>
          The tooltip should be wrapped around this
        </Tooltip>
      );

      await userEvent.hover(
        screen.getByText('The tooltip should be wrapped around this')
      );

      expect(screen.getByText('Tooltip content').nodeName).toBe('SPAN');
    });

    test('with class', () => {
      const { container } = render(
        <Tooltip className="extra-classnames" content="Tooltip content">
          The tooltip should be wrapped around this
        </Tooltip>
      );
      expect(container.firstChild).toHaveClass('extra-classnames');
    });

    test('with style', () => {
      const { container } = render(
        <Tooltip
          style={{ marginTop: 5, padding: 10 }}
          content="Tooltip content"
        >
          The tooltip should be wrapped around this
        </Tooltip>
      );
      expect(container.firstChild).toHaveStyle({
        marginTop: '5px',
        padding: '10px',
        outline: 0
      });
    });

    test('with style, override outline', () => {
      const { container } = render(
        <Tooltip style={{ outline: 20 }} content="Tooltip content">
          The tooltip should be wrapped around this
        </Tooltip>
      );
      expect(container.firstChild).toHaveStyle({ outline: '20px' });
    });
  });
});
