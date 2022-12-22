import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Tab } from './Tab';

describe('Component: Tab', () => {
  function setup({
    active = false,
    hasIcon,
    hasIconColor,
    show,
    disabled
  }: {
    active?: boolean;
    hasIcon?: boolean;
    hasIconColor?: boolean;
    show?: boolean;
    disabled?: boolean;
  }) {
    const onClickSpy = vi.fn();
    const showSpy = vi.fn().mockReturnValue(show);

    const { container } = render(
      <Tab
        active={active}
        label="test"
        onClick={onClickSpy}
        icon={hasIcon ? 'close' : undefined}
        iconColor={hasIconColor ? 'primary' : undefined}
        show={show !== undefined ? showSpy : undefined}
        disabled={disabled}
      >
        {() => <p>test</p>}
      </Tab>
    );

    return { container, onClickSpy, showSpy };
  }

  it('should return null when show returns false', () => {
    const { container, showSpy } = setup({ show: false });

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('without icon', () => {
      setup({});
      expect(screen.queryByText('close')).toBeNull();
    });

    test('with icon', async () => {
      expect.assertions(0);
      setup({ hasIcon: true });
      await screen.findByText('close');
    });

    test('icon color', () => {
      setup({ hasIcon: true, hasIconColor: true });
      expect(screen.getByText('close').classList.contains('text-primary')).toBe(
        true
      );
    });

    test('active', () => {
      const { container } = setup({ active: true });
      expect(
        // @ts-expect-error HTMLElement has property classList
        container.firstChild?.firstChild?.classList.contains('active')
      ).toBe(true);
    });

    test('not active', () => {
      const { container } = setup({});
      expect(
        // @ts-expect-error HTMLElement has property classList
        container.firstChild?.firstChild?.classList.contains('active')
      ).toBe(false);
    });

    test('disabled', () => {
      const { container } = setup({ disabled: true });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('disabled')).toBe(true);
    });

    test('not disabled', () => {
      const { container } = setup({ disabled: false });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('disabled')).toBe(false);
    });
  });

  describe('events', () => {
    it('should call onClick when NavLink is clicked', () => {
      const { onClickSpy } = setup({});

      expect(onClickSpy).toHaveBeenCalledTimes(0);

      fireEvent.click(screen.getByText('test'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
