import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Tag } from './Tag';

describe('Component: Tag', () => {
  describe('ui', () => {
    test('default', () => {
      const { container } = render(
        <Tag text="Maarten" />
      );
      expect(container).toMatchSnapshot();
    });

    test('with type', () => {
      const { container } = render(
        <Tag text="Maarten" color="success" />
      );
      expect(container.firstChild).toHaveClass('badge rounded-pill text-bg-success');
    });

    test('with remove', () => {
      const { container } = render(
        <Tag text="Maarten" onRemove={jest.fn()} />
      );
      expect(screen.queryByText('×')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  test('onRemove', () => {
    const onRemoveSpy = jest.fn();
    render(
      <Tag text="Maarten" onRemove={onRemoveSpy} />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onRemoveSpy).toHaveBeenCalledTimes(1);
  });
});
