import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Icon } from './Icon';
import * as components from './index';

describe('index', () => {
  it('should contain exports', () => {
    expect(components).toMatchSnapshot();
  });
});

describe('Icon', () => {
  describe('ui', () => {
    test('default', () => {
      const { container } = render(<Icon icon="alarm" />);
      expect(container).toMatchSnapshot();
    });

    test('with id', () => {
      const { container } = render(<Icon icon="alarm" id="1337" />);
      expect(container).toMatchSnapshot();
    });

    test('with color', () => {
      const { container } = render(
        <Icon icon="alarm" id="1337" color="danger" />
      );
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('text-danger')).toBe(
        true
      );
    });

    test('with className', () => {
      const { container } = render(
        <Icon icon="alarm" className="text-danger" />
      );
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('text-danger')).toBe(
        true
      );
    });

    test('is clickable', () => {
      const { container } = render(
        <Icon icon="alarm" onClick={() => undefined} />
      );
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('clickable')).toBe(true);
    });

    test('is not clickable', () => {
      const { container } = render(<Icon icon="alarm" onClick={undefined} />);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('clickable')).toBe(false);
    });

    test('is disabled', () => {
      const { container } = render(
        <Icon icon="alarm" onClick={() => undefined} disabled={true} />
      );
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('icon--disabled')).toBe(
        true
      );
    });

    test('is enabled', () => {
      const { container } = render(<Icon icon="alarm" disabled={false} />);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('icon--disabled')).toBe(
        false
      );
    });

    test('with size', () => {
      const { container } = render(<Icon icon="alarm" size={144} />);
      // @ts-expect-error Child node is an Element
      expect(getComputedStyle(container.firstChild).fontSize).toBe('144px');
    });
  });

  describe('hoverColor', () => {
    it('should use hoverColor when onClick and hoverColor are defined', async () => {
      expect.assertions(1);
      const { container } = render(
        <Icon
          icon="alarm"
          color="secondary"
          hoverColor="primary"
          onClick={vi.fn()}
        />
      );
      await userEvent.hover(screen.getByText('alarm'));
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('text-primary')).toBe(
        true
      );
    });

    it('should not use hoverColor when onClick is not defined', async () => {
      expect.assertions(1);
      const { container } = render(
        <Icon icon="alarm" color="secondary" hoverColor="primary" />
      );
      await userEvent.hover(screen.getByText('alarm'));
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('text-secondary')).toBe(
        true
      );
    });

    it('should not use hoverColor when onClick and hoverColor are defined but icon is disabled', async () => {
      expect.assertions(1);
      const { container } = render(
        <Icon
          icon="alarm"
          color="secondary"
          hoverColor="primary"
          onClick={vi.fn()}
          disabled={true}
        />
      );
      await userEvent.hover(screen.getByText('alarm'));
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('text-secondary')).toBe(
        true
      );
    });
  });

  describe('events', () => {
    it('should call the "onClick" event when the icon is clicked', () => {
      const onClickSpy = vi.fn();

      render(<Icon icon="alarm" onClick={onClickSpy} />);

      fireEvent.click(screen.getByText('alarm'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should call the "onClick" event when the icon is clicked and is explicitly enabled', () => {
      const onClickSpy = vi.fn();

      render(<Icon icon="alarm" onClick={onClickSpy} disabled={false} />);

      fireEvent.click(screen.getByText('alarm'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call the "onClick" event when the icon is clicked but is disabled', () => {
      const onClickSpy = vi.fn();

      render(<Icon icon="alarm" onClick={onClickSpy} disabled={true} />);

      fireEvent.click(screen.getByText('alarm'));

      expect(onClickSpy).toHaveBeenCalledTimes(0);
    });
  });
});
