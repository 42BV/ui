import React from 'react';
import { render } from '@testing-library/react';

import { Spinner } from './Spinner';

describe('Component: Spinner', () => {
  test('ui', () => {
    const { container } = render(
      <Spinner color="white" size={42} />
    );
    expect(container).toMatchSnapshot();
  });
});
