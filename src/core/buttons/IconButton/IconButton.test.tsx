import { getIconSize, IconButton } from './IconButton';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useShowSpinner } from '../useShowSpinner';

describe('icon only', () => {
  test('that when no icon is provided it will fallback to block', () => {
    const { container } = render(<IconButton />);

    expect(container).toMatchSnapshot();
  });

  describe('inProgress', () => {
    test('inProgress is true', () => {
      const { container } = render(
        <IconButton onClick={jest.fn()} inProgress={true} icon="save" />
      );

      expect(container).toMatchSnapshot();
    });

    test('inProgress is false', () => {
      const { container } = render(
        <IconButton onClick={jest.fn()} inProgress={false} icon="save" />
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('disabled', () => {
    test('is disabled', () => {
      const { container } = render(
        <IconButton onClick={jest.fn()} icon="save" disabled={true} />
      );

      expect(container).toMatchSnapshot();
    });

    test('is enabled', () => {
      const { container } = render(
        <IconButton onClick={jest.fn()} icon="save" disabled={false} />
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('full-width', () => {
    test('full width and icon left', () => {
      const { container } = render(
        <IconButton
          onClick={jest.fn()}
          icon="save"
          fullWidth={true}
          iconPosition="left"
        />
      );

      expect(container).toMatchSnapshot();
    });

    test('full width and icon right', () => {
      const { container } = render(
        <IconButton
          onClick={jest.fn()}
          icon="save"
          fullWidth={true}
          iconPosition="right"
        />
      );

      expect(container).toMatchSnapshot();
    });
  });
});

describe('icon', () => {
  function setup({ inProgress }: { inProgress: boolean }) {
    const onClickSpy = jest.fn();

    jest
      .spyOn({ useShowSpinner }, 'useShowSpinner')
      .mockReturnValue(inProgress);

    const { container } = render(
      <IconButton onClick={onClickSpy} inProgress={inProgress} icon="save" />
    );

    return { container, onClickSpy };
  }

  it('should call the onClick callback when inProgress is false', () => {
    const { onClickSpy } = setup({
      inProgress: false
    });

    fireEvent.click(screen.getByText('save'));

    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });
});

test('Util: getIconSize', () => {
  expect(getIconSize('lg')).toBe(32);
  expect(getIconSize('md')).toBe(24);
  expect(getIconSize('sm')).toBe(16);
});
