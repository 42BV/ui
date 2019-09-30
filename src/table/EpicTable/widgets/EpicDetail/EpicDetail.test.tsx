import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicDetail } from './EpicDetail';
import { Icon } from '../../../../core/Icon';

describe('Component: EpicDetail', () => {
  function setup() {
    const onCloseSpy = jest.fn();

    function children() {
      return <h1>children</h1>;
    }

    const epicDetail = shallow(
      <EpicDetail onClose={onCloseSpy}>
        {children}
      </EpicDetail>
    );

    return { epicDetail, onCloseSpy };
  }

  test('ui', () => {
    const { epicDetail } = setup();

    expect(toJson(epicDetail)).toMatchSnapshot();
  });

  describe('events', () => {
    it('should call the onClose callback when the close button is clicked', () => {
      const { epicDetail, onCloseSpy } = setup();

      const event = new MouseEvent('click');

      epicDetail
        .find(Icon)
        .props()
        // @ts-ignore
        .onClick(event);

      expect(onCloseSpy).toBeCalledTimes(1);
      expect(onCloseSpy).toBeCalledWith(event);
    });
  });
});
