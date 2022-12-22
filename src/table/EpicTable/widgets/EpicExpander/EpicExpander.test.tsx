import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { EpicExpander } from './EpicExpander';

describe('Component: EpicExpander', () => {
  function setup({ open }: { open: boolean }) {
    const onChangeSpy = vi.fn();

    const { container } = render(
      <EpicExpander onChange={onChangeSpy} open={open} />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('is open', async () => {
      expect.assertions(2);
      const { container } = setup({ open: true });
      expect(container).toMatchSnapshot();
      await screen.findByText('expand_less');
      expect(screen.queryByText('expand_more')).toBeNull();
    });

    test('is closed', async () => {
      expect.assertions(1);
      setup({ open: false });
      expect(screen.queryByText('expand_less')).toBeNull();
      await screen.findByText('expand_more');
    });
  });

  describe('events', () => {
    it('should open the expander on click when it is closed', () => {
      const { onChangeSpy } = setup({ open: false });

      fireEvent.click(screen.getByText('expand_more'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(true);
    });

    it('should close the expander when it is clicked when it is open', () => {
      const { onChangeSpy } = setup({ open: true });

      fireEvent.click(screen.getByText('expand_less'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(false);
    });
  });
});
