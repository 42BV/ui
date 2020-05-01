import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Popover from './Popover';

describe('Component: Popover', () => {
  describe('ui', () => {
    test('default', () => {
      const popover = shallow(
        <Popover
          target={
            <div>The popover should be wrapped around this div, in a span</div>
          }
        >
          Popover content
        </Popover>
      );
      expect(toJson(popover)).toMatchSnapshot(
        'Component: Popover => ui => default'
      );
    });

    test('with custom tag', () => {
      const popover = shallow(
        <Popover tag="div" target="target">
          Popover content
        </Popover>
      );
      expect(toJson(popover)).toMatchSnapshot(
        'Component: Popover => ui => with tag'
      );
    });

    test('with class', () => {
      const popover = shallow(
        <Popover className="extra-classnames" target="target">
          Popover content
        </Popover>
      );
      expect(popover.find('span').props().className).toBe('extra-classnames');
    });

    test('with optional properties', () => {
      const popover = shallow(
        <Popover
          style={{ marginTop: 5, padding: 10 }}
          isOpen={true}
          distance={10}
          placement="bottom"
          hideOnClick={false}
          target={
            <div>The popover should be wrapped around this div, in a div</div>
          }
        >
          Popover content
        </Popover>
      );

      expect(toJson(popover)).toMatchSnapshot(
        'Component: Popover => ui => with optional properties'
      );
    });
  });
});
