import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicSort } from './EpicSort';
import { Icon } from '../../../../core/Icon';
import { Direction } from '../../types';

import * as utils from './utils';

describe('Component: EpicSort', () => {
  function setup({ direction }: { direction: Direction }) {
    jest.spyOn(utils, 'nextDirection').mockReturnValue('ASC');

    const onChangeSpy = jest.fn();

    const epicSelection = shallow(
      <EpicSort onChange={onChangeSpy} direction={direction} />
    );

    return { epicSelection, onChangeSpy };
  }

  describe('ui', () => {
    test('is ASC', () => {
      const { epicSelection } = setup({ direction: 'ASC' });

      expect(toJson(epicSelection)).toMatchSnapshot();
    });

    test('is DESC', () => {
      const { epicSelection } = setup({ direction: 'DESC' });

      expect(toJson(epicSelection)).toMatchSnapshot();
    });

    test('is NONE', () => {
      const { epicSelection } = setup({ direction: 'NONE' });

      expect(toJson(epicSelection)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should call onChange with true when checkbox is clicked while not checked', () => {
      const { epicSelection, onChangeSpy } = setup({ direction: 'DESC' });

      // @ts-expect-error Test mock
      epicSelection
        .find(Icon)
        .props()
        // @ts-expect-error Test mock
        .onClick(new Event('click'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('ASC');
    });
  });
});
