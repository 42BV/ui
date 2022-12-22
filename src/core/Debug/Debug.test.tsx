import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { Debug } from './Debug';

describe('Component: Debug', () => {
  function setup({ defaultOpen }: { defaultOpen?: boolean }) {
    const { container } = render(
      <Debug value={{ property: 'test' }} defaultOpen={defaultOpen} />
    );
    return { container };
  }

  test('ui', () => {
    const { container } = setup({});

    expect(container).toMatchSnapshot();
  });

  it('should start closed when open is false', () => {
    setup({ defaultOpen: false });

    expect(screen.queryByText('{ "property": "test" }')).toBeNull();
  });

  it('should start open when open is true', async () => {
    expect.assertions(0);

    setup({ defaultOpen: true });

    await screen.findByText('{ "property": "test" }');
  });

  it('should start open when open is undefined', async () => {
    expect.assertions(0);

    setup({});

    await screen.findByText('{ "property": "test" }');
  });

  describe('events', () => {
    it('should toggle isOpen', async () => {
      expect.assertions(20);

      vi.spyOn(React, 'useState').mockReturnValue([true, vi.fn()]);

      setup({});

      await screen.findByText('{ "property": "test" }');

      fireEvent.click(screen.getByText('expand_more'));

      await waitFor(() => {
        expect(screen.queryByText('{ "property": "test" }')).toBeNull();
      });
    });
  });
});
