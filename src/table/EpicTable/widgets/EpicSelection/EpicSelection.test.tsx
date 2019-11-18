import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicSelection } from './EpicSelection';
import { Input } from 'reactstrap';

describe('Component: EpicSelection', () => {
  function setup({ checked }: { checked: boolean }) {
    const onChangeSpy = jest.fn();

    const epicSelection = shallow(
      <EpicSelection onChange={onChangeSpy} checked={checked} />
    );

    return { epicSelection, onChangeSpy };
  }

  describe('ui', () => {
    test('is checked', () => {
      const { epicSelection } = setup({ checked: true });

      expect(toJson(epicSelection)).toMatchSnapshot();
    });

    test('is not checked', () => {
      const { epicSelection } = setup({ checked: false });

      expect(toJson(epicSelection)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should call onChange with true when checkbox is clicked while not checked', () => {
      const { epicSelection, onChangeSpy } = setup({ checked: false });

      // @ts-ignore
      epicSelection
        .find(Input)
        .props()
        // @ts-ignore
        .onChange(new Event('click'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(true);
    });

    it('should call onChange with false when checkbox is clicked while checked', () => {
      const { epicSelection, onChangeSpy } = setup({ checked: true });

      // @ts-ignore
      epicSelection
        .find(Input)
        .props()
        // @ts-ignore
        .onChange(new Event('click'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(false);
    });
  });
});
