import React from 'react';
import { render } from '@testing-library/react';

import { EpicFormCell } from './EpicFormCell';

describe('Component: EpicFormCell', () => {
  test('ui', () => {
    const { container } = render(
      <EpicFormCell width={200} height={48}>
        just a test
      </EpicFormCell>
    );
    expect(container).toMatchSnapshot();
  });
});
