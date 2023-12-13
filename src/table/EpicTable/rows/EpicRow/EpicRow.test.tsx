import { render } from '@testing-library/react';

import { EpicRow } from './EpicRow';

describe('Component: EpicRow', () => {
  function setup() {
    const { container } = render(
      <EpicRow>
        <h1>children</h1>
      </EpicRow>
    );

    return { container };
  }

  test('is header row', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });
});
