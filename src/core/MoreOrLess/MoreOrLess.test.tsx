import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { MoreOrLess } from './MoreOrLess';

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
    test('open', async () => {
      expect.assertions(2);
      const { container } = setup({ exceedsLimit: true });
      fireEvent.click(screen.getByText('Show 3 more'));
      expect(screen.queryByText('Show 3 more')).toBeNull();
      await screen.findByText('Show less');
      expect(container).toMatchSnapshot();
    });

    test('closed', async () => {
      expect.assertions(2);
      const { container } = setup({ exceedsLimit: true });
      await screen.findByText('Show 3 more');
      expect(screen.queryByText('Show less')).toBeNull();
      expect(container).toMatchSnapshot();
    });

    test('too few items', () => {
      setup({ exceedsLimit: false });
      expect(screen.queryByText('Show 3 more')).toBeNull();
      expect(screen.queryByText('Show less')).toBeNull();
    });

    test('with custom text', async () => {
      expect.assertions(0);

      setup({
        exceedsLimit: true,
        text: {
          more: (amount) => `Load ${amount} more...`
        }
      });

      await screen.findByText('Load 3 more...');
    });
  });

  test('toggle', async () => {
    expect.assertions(5);

    const { container } = setup({ exceedsLimit: true });

    expect(container).toMatchSnapshot('closed');
    await screen.findByText('Show 3 more');
    expect(screen.queryByText('Show less')).toBeNull();

    fireEvent.click(screen.getByText('Show 3 more'));

    expect(screen.queryByText('Show 3 more')).toBeNull();
    await screen.findByText('Show less');
    expect(container).toMatchSnapshot('open');

    fireEvent.click(screen.getByText('Show less'));

    await screen.findByText('Show 3 more');
    expect(screen.queryByText('Show less')).toBeNull();
  });
});
