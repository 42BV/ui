import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import MoreOrLess from './MoreOrLess';

describe('Component: MoreOrLess', () => {
  function setup({
    exceedsLimit,
    text
  }: {
    exceedsLimit: boolean;
    text?: { more?: (amount: number) => string; less?: string };
  }) {
    let content: JSX.Element[];
    if (exceedsLimit) {
      content = [
        <h1 key={1}>1</h1>,
        <h1 key={2}>2</h1>,
        <h1 key={3}>3</h1>,
        <h1 key={4}>4</h1>,
        <h1 key={5}>5</h1>,
        <h1 key={6}>6</h1>
      ];
    } else {
      content = [<h1 key={1}>1</h1>, <h1 key={2}>2</h1>, <h1 key={3}>3</h1>];
    }

    const { container } = render(
      <MoreOrLess limit={3} content={content} text={text} />
    );
    
    return { container };
  }

  describe('ui', () => {
    test('open', () => {
      const { container } = setup({ exceedsLimit: true });
      fireEvent.click(screen.getByText('Show 3 more'));
      expect(screen.queryByText('Show 3 more')).not.toBeInTheDocument();
      expect(screen.queryByText('Show less')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('closed', () => {
      const { container } = setup({ exceedsLimit: true });
      expect(screen.queryByText('Show 3 more')).toBeInTheDocument();
      expect(screen.queryByText('Show less')).not.toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('too few items', () => {
      setup({ exceedsLimit: false });
      expect(screen.queryByText('Show 3 more')).not.toBeInTheDocument();
      expect(screen.queryByText('Show less')).not.toBeInTheDocument();
    });

    test('with custom text', () => {
      setup({
        exceedsLimit: true,
        text: {
          more: (amount) => `Load ${amount} more...`
        }
      });

      expect(screen.queryByText('Load 3 more...')).toBeInTheDocument();
    });
  });

  test('toggle', () => {
    const { container } = setup({ exceedsLimit: true });

    expect(container).toMatchSnapshot('closed');
    expect(screen.queryByText('Show 3 more')).toBeInTheDocument();
    expect(screen.queryByText('Show less')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Show 3 more'));

    expect(screen.queryByText('Show 3 more')).not.toBeInTheDocument();
    expect(screen.queryByText('Show less')).toBeInTheDocument();
    expect(container).toMatchSnapshot('open');

    fireEvent.click(screen.getByText('Show less'));

    expect(screen.queryByText('Show 3 more')).toBeInTheDocument();
    expect(screen.queryByText('Show less')).not.toBeInTheDocument();
  });
});
