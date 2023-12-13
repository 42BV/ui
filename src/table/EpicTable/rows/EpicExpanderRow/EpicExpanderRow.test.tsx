import { render } from '@testing-library/react';

import { EpicExpanderRow } from './EpicExpanderRow';

describe('Component: EpicExpanderRow', () => {
  function setup({ active }: { active: boolean }) {
    function children() {
      return <h1>children</h1>;
    }

    const injected = {
      width: 100
    };

    const { container } = render(
      <EpicExpanderRow active={active} height={44} {...injected}>
        {children}
      </EpicExpanderRow>
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
