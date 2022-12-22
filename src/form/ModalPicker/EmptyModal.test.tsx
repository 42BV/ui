import React from 'react';
import { render, screen } from '@testing-library/react';

import { EmptyModal } from './EmptyModal';
import { expect } from 'vitest';

describe('Component: EmptyModal', () => {
  test('mode: empty', async () => {
    expect.assertions(1);
    const { container } = render(<EmptyModal userHasSearched={false} />);
    expect(container).toMatchSnapshot();
    await screen.findByText(
      'There is nothing here yet, the collection is empty.'
    );
  });

  test('mode: no-results', async () => {
    expect.assertions(1);
    const { container } = render(<EmptyModal userHasSearched={true} />);
    expect(container).toMatchSnapshot();
    await screen.findByText(
      'No results were found please try again with a different query.'
    );
  });
});
