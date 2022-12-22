import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { EpicSort } from './EpicSort';
import { EpicTableSortDirection } from '../../types';

import * as utils from './utils';

describe('Component: EpicSort', () => {
  function setup({ direction }: { direction: EpicTableSortDirection }) {
    vi.spyOn(utils, 'nextDirection').mockReturnValue('ASC');

    const onChangeSpy = vi.fn();

    const { container } = render(
      <EpicSort onChange={onChangeSpy} direction={direction} />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('is ASC', async () => {
      expect.assertions(3);
      const { container } = setup({ direction: 'ASC' });
      expect(container).toMatchSnapshot();
      await screen.findByText('arrow_drop_up');
      expect(screen.queryByText('arrow_drop_down')).toBeNull();
      expect(screen.queryByText('sort')).toBeNull();
    });

    test('is DESC', async () => {
      expect.assertions(2);
      setup({ direction: 'DESC' });
      expect(screen.queryByText('arrow_drop_up')).toBeNull();
      await screen.findByText('arrow_drop_down');
      expect(screen.queryByText('sort')).toBeNull();
    });

    test('is NONE', async () => {
      expect.assertions(2);
      setup({ direction: 'NONE' });
      expect(screen.queryByText('arrow_drop_up')).toBeNull();
      expect(screen.queryByText('arrow_drop_down')).toBeNull();
      await screen.findByText('sort');
    });
  });

  describe('events', () => {
    it('should call onChange with true when checkbox is clicked while not checked', () => {
      const { onChangeSpy } = setup({ direction: 'DESC' });

      fireEvent.click(screen.getByText('arrow_drop_down'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('ASC');
    });
  });
});
