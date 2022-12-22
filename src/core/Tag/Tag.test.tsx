import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Tag } from './Tag';

describe('Component: Tag', () => {
  describe('ui', () => {
    test('default', () => {
      const { container } = render(<Tag text="Maarten" />);
      expect(container).toMatchSnapshot();
    });

    test('with type', () => {
      const { container } = render(<Tag text="Maarten" color="success" />);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('badge')).toBe(true);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('rounded-pill')).toBe(
        true
      );
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild?.classList.contains('text-bg-success')).toBe(
        true
      );
    });

    test('with remove', async () => {
      expect.assertions(1);
      const { container } = render(<Tag text="Maarten" onRemove={vi.fn()} />);
      await screen.findByText('×');
      expect(container).toMatchSnapshot();
    });
  });

  test('onRemove', () => {
    const onRemoveSpy = vi.fn();
    render(<Tag text="Maarten" onRemove={onRemoveSpy} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onRemoveSpy).toHaveBeenCalledTimes(1);
  });
});
