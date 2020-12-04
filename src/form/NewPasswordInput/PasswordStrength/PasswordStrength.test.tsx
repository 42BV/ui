import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as MeterWidth from './useMeterWidth/useMeterWidth';
import * as Rules from './useRules/useRules';

import PasswordStrength from './PasswordStrength';

describe('Component: PasswordStrength', () => {
  function setup({
    password = '',
    showMeter
  }: {
    password?: string;
    showMeter?: boolean;
  }) {
    const passwordStrength = shallow(
      <PasswordStrength
        password={password}
        rules={['lowercase', 'minimumLength']}
        showMeter={showMeter}
      />
    );

    return { passwordStrength };
  }

  describe('ui', () => {
    it('default', () => {
      const { passwordStrength } = setup({});
      expect(toJson(passwordStrength)).toMatchSnapshot(
        'Component: PasswordStrength => ui => default'
      );
    });

    it('without meter', () => {
      const { passwordStrength } = setup({ showMeter: false });
      expect(toJson(passwordStrength)).toMatchSnapshot(
        'Component: PasswordStrength => ui => without meter'
      );
    });
  });

  describe('events', () => {
    it('should display the progress bar in color warning when password strength 75%', () => {
      jest.spyOn(MeterWidth, 'useMeterWidth').mockReturnValue(75);

      const { passwordStrength } = setup({});

      expect(passwordStrength.find('Progress').props().color).toBe('warning');
    });

    it('should display the progress bar in color warning when password strength 100%', () => {
      jest.spyOn(MeterWidth, 'useMeterWidth').mockReturnValue(100);

      const { passwordStrength } = setup({});

      expect(passwordStrength.find('Progress').props().color).toBe('success');
    });

    it('should display the rule with a red cross', () => {
      const { passwordStrength } = setup({});

      expect(
        passwordStrength
          .find('Icon')
          .at(0)
          // @ts-expect-error Test mock
          .props().icon
      ).toBe('cancel');
      expect(passwordStrength.find('Icon').at(0).props().color).toBe('danger');
    });

    it('should display the rule with a green checkmark', () => {
      jest.spyOn(Rules, 'useRules').mockReturnValue({ lowercase: true });

      const { passwordStrength } = setup({});

      expect(
        passwordStrength
          .find('Icon')
          .at(0)
          // @ts-expect-error Test mock
          .props().icon
      ).toBe('check_circle');
      expect(passwordStrength.find('Icon').at(0).props().color).toBe('success');
    });
  });
});
