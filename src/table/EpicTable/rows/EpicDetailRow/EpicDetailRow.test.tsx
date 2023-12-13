import { render } from '@testing-library/react';

import { EpicDetailRow } from './EpicDetailRow';

describe('Component: EpicDetailRow', () => {
  function setup({ active }: { active: boolean }) {
    function children() {
      return <h1>children</h1>;
    }

    const injected = {
      width: 100,
      top: 1900,
      height: 100
    };

    const { container } = render(
      <EpicDetailRow active={active} left={300} {...injected}>
        {children}
      </EpicDetailRow>
    );

    return { container };
  }

  test('is active', () => {
    const { container } = setup({ active: true });
    expect(container).toMatchSnapshot();
  });

  test('is not active', () => {
    const { container } = setup({ active: false });
    expect(container.firstChild).toBeNull();
  });
});
