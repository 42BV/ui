import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import InfoBadge from './InfoBadge';

describe('Component: InfoBadge', () => {
  test('ui', () => {
    const { container } = render(
      <InfoBadge value={5} color="primary">
        <h1>Children</h1>
      </InfoBadge>
    );
    expect(container).toMatchSnapshot();
  });

  test('with extra className', () => {
    const { container } = render(
      <InfoBadge className="extra-class" value={5} color="primary">
        <h1>Children</h1>
      </InfoBadge>
    );
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
