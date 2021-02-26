import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { SuccessIcon } from './SuccessIcon';

describe('Component: SuccessIcon', () => {
  function setup({ value }: { value: boolean }) {
    const successIcon = shallow(<SuccessIcon value={value} />);

    return { successIcon };
  }

  describe('ui', () => {
    test('value true', () => {
      const { successIcon } = setup({ value: true });

      expect(toJson(successIcon)).toMatchSnapshot(
        'Component: SuccessIcon => ui => value true'
      );
    });

    test('value false', () => {
      const { successIcon } = setup({ value: false });

      expect(
        // @ts-expect-error Test mock
        successIcon.find('Icon').props().icon
      ).toBe('clear');
    });
  });
});
