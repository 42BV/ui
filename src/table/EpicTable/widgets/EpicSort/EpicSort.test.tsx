import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EpicSort } from './EpicSort';
import { EpicTableSortDirection } from '../../types';

import * as utils from './utils';

describe('Component: EpicSort', () => {
  function setup({ direction }: { direction: EpicTableSortDirection }) {
    jest.spyOn(utils, 'nextDirection').mockReturnValue('ASC');

    const onChangeSpy = jest.fn();

    const { container } = render(
      <EpicSort onChange={onChangeSpy} direction={direction} />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('is ASC', () => {
      const { container } = setup({ direction: 'ASC' });
      expect(container).toMatchSnapshot();
      expect(screen.queryByText('arrow_drop_up')).toBeInTheDocument();
      expect(screen.queryByText('arrow_drop_down')).not.toBeInTheDocument();
      expect(screen.queryByText('sort')).not.toBeInTheDocument();
    });

    test('is DESC', () => {
      setup({ direction: 'DESC' });
      expect(screen.queryByText('arrow_drop_up')).not.toBeInTheDocument();
      expect(screen.queryByText('arrow_drop_down')).toBeInTheDocument();
      expect(screen.queryByText('sort')).not.toBeInTheDocument();
    });

    test('is NONE', () => {
      setup({ direction: 'NONE' });
      expect(screen.queryByText('arrow_drop_up')).not.toBeInTheDocument();
      expect(screen.queryByText('arrow_drop_down')).not.toBeInTheDocument();
      expect(screen.queryByText('sort')).toBeInTheDocument();
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
