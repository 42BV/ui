import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EpicExpander } from './EpicExpander';

describe('Component: EpicExpander', () => {
  function setup({ open }: { open: boolean }) {
    const onChangeSpy = jest.fn();

    const { container } = render(
      <EpicExpander onChange={onChangeSpy} open={open} />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('is open', () => {
      const { container } = setup({ open: true });
      expect(container).toMatchSnapshot();
      expect(screen.queryByText('expand_less')).toBeInTheDocument();
      expect(screen.queryByText('expand_more')).not.toBeInTheDocument();
    });

    test('is closed', () => {
      setup({ open: false });
      expect(screen.queryByText('expand_less')).not.toBeInTheDocument();
      expect(screen.queryByText('expand_more')).toBeInTheDocument();
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
