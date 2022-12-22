import React from 'react';
import { render, screen } from '@testing-library/react';

import { Popover } from './Popover';

describe('Component: Popover', () => {
  describe('ui', () => {
    test('default', () => {
      const { container } = render(
        <Popover
          target={
            <div>The popover should be wrapped around this div, in a span</div>
          }
        >
          Popover content
        </Popover>
      );
      expect(container).toMatchSnapshot();
    });

    test('open', () => {
      const { container } = render(
        <Popover
          isOpen={true}
          target={
            <div>The popover should be wrapped around this div, in a span</div>
          }
        >
          Popover content
        </Popover>
      );
      expect(container).toMatchSnapshot();
    });

    test('with custom tag', () => {
      render(
        <Popover tag="div" target="target">
          Popover content
        </Popover>
      );
      expect(screen.getByText('target').tagName).toBe('DIV');
    });

    test('with class', () => {
      render(
        <Popover className="extra-classnames" target="target">
          Popover content
        </Popover>
      );
      expect(
        screen.getByText('target').classList.contains('extra-classnames')
      ).toBe(true);
    });

    test('with optional properties', () => {
      const { container } = render(
        <Popover
          style={{ marginTop: 5, padding: 10 }}
          isOpen={true}
          distance={10}
          placement="bottom"
          onClickOutside={vi.fn()}
          target={
            <div>The popover should be wrapped around this div, in a div</div>
          }
        >
          Popover content
        </Popover>
      );

      expect(container).toMatchSnapshot();
    });
  });
});
