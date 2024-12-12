import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
      expect(screen.getByText('target')).toHaveClass('extra-classnames');
    });

    test('with optional properties', () => {
      const { container } = render(
        <Popover
          style={{ marginTop: 5, padding: 10 }}
          isOpen={true}
          distance={10}
          placement="bottom"
          onClickOutside={jest.fn()}
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

  describe('events', () => {
    it('should call onClick when tag is clicked', () => {
      const onClickSpy = jest.fn();
      render(
        <Popover onClick={onClickSpy} target={<>Click this</>} tag="button">
          Popover content
        </Popover>
      );
      fireEvent.click(screen.getByText('Click this'));
      expect(onClickSpy).toBeCalledTimes(1);
    });

    it('should open on click when openOnClick is true', () => {
      render(
        <Popover openOnClick={true} target={<>Click this</>} tag="button">
          Popover content
        </Popover>
      );
      fireEvent.click(screen.getByText('Click this'));
      expect(screen.queryByText('Popover content')).toBeInTheDocument();
    });
  });
});
