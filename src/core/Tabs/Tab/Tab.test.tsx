import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    const onClickSpy = jest.fn();
    const showSpy = jest.fn().mockReturnValue(show);

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
      expect(screen.queryByText('close')).not.toBeInTheDocument();
    });

    test('with icon', () => {
      setup({ hasIcon: true });
      expect(screen.queryByText('close')).toBeInTheDocument();
    });

    test('icon color', () => {
      setup({ hasIcon: true, hasIconColor: true });
      expect(screen.getByText('close')).toHaveClass('text-primary');
    });

    test('active', () => {
      const { container } = setup({ active: true });
      expect(container.firstChild?.firstChild).toHaveClass('active');
    });

    test('not active', () => {
      const { container } = setup({});
      expect(container.firstChild?.firstChild).not.toHaveClass('active');
    });

    test('disabled', () => {
      const { container } = setup({ disabled: true });
      expect(container.firstChild).toHaveClass('disabled');
    });

    test('not disabled', () => {
      const { container } = setup({ disabled: false });
      expect(container.firstChild).not.toHaveClass('disabled');
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
