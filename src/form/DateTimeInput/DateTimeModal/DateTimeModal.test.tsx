import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { DateTimeModal } from './DateTimeModal';

import moment from 'moment';

describe('Component: DateTimeModal', () => {
  let console;

  afterEach(() => {
    global.console = console;
  });

  function setup({ hasValue }: { hasValue?: boolean }) {
    const onCloseSpy = vi.fn();
    const onSaveSpy = vi.fn();
    const isDateAllowedSpy = vi.fn().mockReturnValue(true);

    console = global.console;
    // @ts-expect-error We only use error, not all the other properties
    global.console = { error: vi.fn() };

    const { container } = render(
      <DateTimeModal
        onClose={onCloseSpy}
        onSave={onSaveSpy}
        dateFormat="YYYY-MM-DD"
        timeFormat="HH:II:SS"
        isDateAllowed={isDateAllowedSpy}
        defaultValue={hasValue ? new Date(2020, 1, 1, 0, 0, 0) : undefined}
      />
    );
    return { container, onCloseSpy, onSaveSpy, isDateAllowedSpy };
  }

  describe('ui', () => {
    test('default', () => {
      setup({ hasValue: true });
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('with value', () => {
      setup({ hasValue: true });
      expect(screen.getAllByText('1')[0].classList.contains('rdtActive')).toBe(
        true
      );
    });

    test('without value', () => {
      setup({});
      const today = new Date();
      expect(
        screen.getAllByText(today.getDate()).map((e) => e.className)
      ).toContain('rdtDay rdtToday');
    });
  });

  describe('events', () => {
    it('should close modal without value when modal is closed', () => {
      const { onCloseSpy, onSaveSpy } = setup({});

      fireEvent.click(screen.getAllByText('1')[0]);
      fireEvent.click(screen.getByText('cancel'));

      expect(onCloseSpy).toBeCalledTimes(1);
      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should close modal with new value when clicking select button', () => {
      const { onCloseSpy, onSaveSpy } = setup({});

      const value = moment.utc(new Date().toString()).startOf('month');

      fireEvent.click(screen.getAllByText('1')[0]);
      fireEvent.click(screen.getByText('save'));

      expect(onSaveSpy).toBeCalledTimes(1);
      expect(value.isSame(onSaveSpy.mock.calls[0][0])).toBe(true);

      expect(onCloseSpy).toBeCalledTimes(0);
    });

    test('is date allowed', () => {
      const isDateAllowedSpy = vi
        .fn()
        .mockImplementation((date) => date.isBefore(new Date()));

      render(
        <DateTimeModal
          onClose={vi.fn()}
          onSave={vi.fn()}
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:II:SS"
          isDateAllowed={isDateAllowedSpy}
        />
      );

      expect(isDateAllowedSpy).toBeCalledTimes(42);
    });
  });
});
