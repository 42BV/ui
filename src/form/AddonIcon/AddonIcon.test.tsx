import React from 'react';
import { render, screen } from '@testing-library/react';

import { AddonIcon } from './AddonIcon';

describe('Component: AddonIcon', () => {
  function setup({ className }: { className?: string }) {
    const { container } = render(
      <AddonIcon icon="360" className={className} />
    );

    return { container };
  }

  test('ui', () => {
    const { container } = setup({});
    expect(container).toMatchSnapshot();
  });

  test('custom class', () => {
    setup({ className: 'extra-class' });
    expect(screen.getByText('360').classList.contains('extra-class')).toBe(
      true
    );
  });
});
