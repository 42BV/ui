import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicExpander } from './EpicExpander';
import Button from '../../../../core/Button/Button';

describe('Component: EpicExpander', () => {
  function setup({ open }: { open: boolean }) {
    const onChangeSpy = jest.fn();

    const epicExpander = shallow(
      <EpicExpander onChange={onChangeSpy} open={open} />
    );

    return { epicExpander, onChangeSpy };
  }

  describe('ui', () => {
    test('is open', () => {
      const { epicExpander } = setup({ open: true });

      expect(toJson(epicExpander)).toMatchSnapshot();
    });

    test('is closed', () => {
      const { epicExpander } = setup({ open: false });

      expect(toJson(epicExpander)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should open the expander when it is clicked when it is closed', () => {
      const { epicExpander, onChangeSpy } = setup({ open: false });

      // @ts-expect-error Test mock
      epicExpander
        .find(Button)
        .props()
        // @ts-expect-error Test mock
        .onClick(new Event('click'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(true);
    });

    it('should close the expander when it is clicked when it is open', () => {
      const { epicExpander, onChangeSpy } = setup({ open: true });

      // @ts-expect-error Test mock
      epicExpander
        .find(Button)
        .props()
        // @ts-expect-error Test mock
        .onClick(new Event('click'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(false);
    });
  });
});
