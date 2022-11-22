import React from 'react';
import { render } from '@testing-library/react';

import { OrSeparator } from './OrSeparator';

describe('Component: OrSeparator', () => {
  function setup() {
    const { container } = render(<OrSeparator />);

    return { container };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup();
      expect(container).toMatchSnapshot();
    });
  });
});
