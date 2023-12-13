import { render } from '@testing-library/react';

import { EpicCellLayout } from './EpicCellLayout';

describe('Component: EpicCellLayout', () => {
  test('vertical', () => {
    const { container } = render(
      <EpicCellLayout mode="vertical">vertical</EpicCellLayout>
    );
    expect(container).toMatchSnapshot();
  });

  test('horizontal', () => {
    const { container } = render(
      <EpicCellLayout mode="horizontal">horizontal</EpicCellLayout>
    );
    expect(container).toMatchSnapshot();
  });
});
