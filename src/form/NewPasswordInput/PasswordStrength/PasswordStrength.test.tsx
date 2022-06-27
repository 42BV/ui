import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
        rules={[ 'lowercase', 'minimumLength' ]}
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
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should display the progress bar in color warning when password strength 75%', () => {
      jest.spyOn(MeterWidth, 'useMeterWidth').mockReturnValue(75);

      setup({});

      expect(screen.getByRole('progressbar')).toHaveClass('bg-warning');
    });

    it('should display the progress bar in color warning when password strength 100%', () => {
      jest.spyOn(MeterWidth, 'useMeterWidth').mockReturnValue(100);

      setup({});

      expect(screen.getByRole('progressbar')).toHaveClass('bg-success');
    });

    it('should display the rule with a red cross', () => {
      setup({});

      expect(screen.queryAllByText('cancel').length).toBe(2);
      expect(screen.getAllByText('cancel')[0]).toHaveClass('text-danger');
    });

    it('should display the rule with a green checkmark', () => {
      jest.spyOn(Rules, 'useRules').mockReturnValue({ lowercase: true });

      setup({});

      expect(screen.queryByText('check_circle')).toBeInTheDocument();
      expect(screen.getByText('check_circle')).toHaveClass('text-success');
    });
  });
});
