import React from 'react';
import { render } from '@testing-library/react';

import { AttributeView } from './AttributeView';

describe('Component: AttributeView', () => {
  test('ui', () => {
    const { container } = render(
      <AttributeView label="Name">42 BV</AttributeView>
    );

    expect(container).toMatchSnapshot();
  });
});
