import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { OpenClose } from './OpenClose';

describe('Component: OpenClose', () => {
  function setup({ isOpen = false }: { isOpen?: boolean }) {
    const openClose = shallow(<OpenClose open={isOpen} />);

    return { openClose };
  }

  describe('ui', () => {
    test('open', () => {
      const { openClose } = setup({ isOpen: true });

      expect(toJson(openClose)).toMatchSnapshot(
        'Component: OpenClose => ui => open'
      );
    });

    test('closed', () => {
      const { openClose } = setup({ isOpen: false });

      expect(toJson(openClose)).toMatchSnapshot(
        'Component: OpenClose => ui => closed'
      );
    });
  });
});
