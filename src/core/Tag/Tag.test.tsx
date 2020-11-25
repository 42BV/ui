import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Tag from './Tag';

describe('Component: Tag', () => {
  describe('ui', () => {
    test('default', () => {
      const tag = shallow(<Tag text="Maarten" />);
      expect(toJson(tag)).toMatchSnapshot('Component: Tag => ui => default');
    });

    test('with type', () => {
      const tag = shallow(<Tag text="Maarten" color="success" />);
      expect(toJson(tag)).toMatchSnapshot('Component: Tag => ui => with type');
    });
  });

  test('onClose', () => {
    const onCloseSpy = jest.fn();
    const tag = shallow(<Tag text="Maarten" onRemove={onCloseSpy} />);

    tag.find('span.close-button').simulate('click');
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
