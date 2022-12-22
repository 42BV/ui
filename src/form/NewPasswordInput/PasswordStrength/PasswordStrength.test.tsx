import React from 'react';
import { render, screen } from '@testing-library/react';

import * as MeterWidth from './useMeterWidth/useMeterWidth';
import * as Rules from './useRules/useRules';

import { PasswordStrength } from './PasswordStrength';

describe('Component: PasswordStrength', () => {
  function setup({
    password = '',
    showMeter
  }: {
    password?: string;
    showMeter?: boolean;
  }) {
    const { container } = render(
      <PasswordStrength
        password={password}
        rules={['lowercase', 'minimumLength']}
        showMeter={showMeter}
      />
    );

    return { container };
  }

  describe('ui', () => {
    it('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    it('without meter', () => {
      setup({ showMeter: false });
      expect(screen.queryByRole('progressbar')).toBeNull();
    });
  });

  describe('events', () => {
    it('should display the progress bar in color warning when password strength 75%', () => {
      vi.spyOn(MeterWidth, 'useMeterWidth').mockReturnValue(75);

      setup({});

      expect(
        screen.getByRole('progressbar').classList.contains('bg-warning')
      ).toBe(true);
    });

    it('should display the progress bar in color warning when password strength 100%', () => {
      vi.spyOn(MeterWidth, 'useMeterWidth').mockReturnValue(100);

      setup({});

      expect(
        screen.getByRole('progressbar').classList.contains('bg-success')
      ).toBe(true);
    });

    it('should display the rule with a red cross', () => {
      setup({});

      expect(screen.queryAllByText('cancel').length).toBe(2);
      expect(
        screen.getAllByText('cancel')[0].classList.contains('text-danger')
      ).toBe(true);
    });

    it('should display the rule with a green checkmark', async () => {
      expect.assertions(1);

      vi.spyOn(Rules, 'useRules').mockReturnValue({ lowercase: true });

      setup({});

      await screen.findByText('check_circle');
      expect(
        screen.getByText('check_circle').classList.contains('text-success')
      ).toBe(true);
    });
  });
});
