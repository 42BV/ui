import React from 'react';
import { render } from '@testing-library/react';

import { Addon } from './Addon';
import { ButtonIconPosition } from '../../../core/Button/Button';

describe('Component: Addon', () => {
  function setup({ position }: { position?: ButtonIconPosition }) {
    const { container } = render(<Addon position={position}>42</Addon>);

    return { container };
  }

  test('ui', () => {
    const { container } = setup({});
    expect(container).toMatchSnapshot();
  });
});
