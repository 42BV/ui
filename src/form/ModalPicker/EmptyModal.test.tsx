import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EmptyModal } from './EmptyModal';

describe('Component: EmptyModal', () => {
  test('mode: empty', () => {
    const { container } = render(
      <EmptyModal userHasSearched={false} />
    );
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('There is nothing here yet, the collection is empty.')).toBeInTheDocument();
  });

  test('mode: no-results', () => {
    const { container } = render(
      <EmptyModal userHasSearched={true} />
    );
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('No results were found please try again with a different query.')).toBeInTheDocument();
  });
});
