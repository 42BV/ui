import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { BooleanIcon } from './BooleanIcon';

describe('Component: BooleanIcon', () => {
  describe('ui', () => {
    test('value true', () => {
      const booleanIcon = shallow(<BooleanIcon value={true} />);

      expect(toJson(booleanIcon)).toMatchSnapshot(
        'Component: BooleanIcon => ui => value true'
      );
    });

    test('value false', () => {
      const booleanIcon = shallow(<BooleanIcon value={false} />);

      expect(
        // @ts-expect-error Test mock
        booleanIcon.find('Icon').props().icon
      ).toBe('check_box_outline_blank');
    });

    test('size', () => {
      const booleanIcon = shallow(<BooleanIcon value={false} size={10} />);

      expect(booleanIcon.find('Icon').props().size).toBe(10);
    });

    test('color', () => {
      const booleanIcon = shallow(
        <BooleanIcon value={false} color="primary" />
      );

      expect(booleanIcon.find('Icon').props().color).toBe('primary');
    });
  });
});
