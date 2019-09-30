import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicHeader } from './EpicHeader';
import { EpicResize } from './EpicResize/EpicResize';

describe('Component: EpicHeader', () => {
  describe('ui', () => {
    test('without resize', () => {
      const epicHeader = shallow(
        <EpicHeader width={300} height={44}>
          epic header
        </EpicHeader>
      );

      expect(toJson(epicHeader)).toMatchSnapshot();
    });

    test('with resize', () => {
      const epicHeader = mount(
        <EpicHeader width={300} height={44} onResize={jest.fn()}>
          epic header
        </EpicHeader>
      );

      expect(toJson(epicHeader)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should call onResize with the width when the user resizes', () => {
      const onResizeSpy = jest.fn();

      const epicHeader = mount(
        <EpicHeader width={300} height={44} onResize={onResizeSpy}>
          epic header
        </EpicHeader>
      );

      epicHeader
        .find(EpicResize)
        .props()
        .onResize(100);

      expect(onResizeSpy).toBeCalledTimes(1);
      expect(onResizeSpy).toBeCalledWith(100);
    });
  });
});
