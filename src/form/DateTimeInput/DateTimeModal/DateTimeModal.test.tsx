import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { DateTimeModal } from './DateTimeModal';

import moment from 'moment';

describe('Component: DateTimeModal', () => {
  let console;

  afterEach(() => {
    global.console = console;
  });

  function setup({ hasValue }: { hasValue?: boolean }) {
    const onCloseSpy = jest.fn();
    const onSaveSpy = jest.fn();
    const isDateAllowedSpy = jest.fn().mockReturnValue(true);

    console = global.console;
    // @ts-expect-error We only use error, not all the other properties
    global.console = { error: jest.fn() };

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
      expect(screen.getAllByText('1')[0]).toHaveClass('rdtActive');
    });

    test('without value', () => {
      setup({});
      const today = new Date();
      expect(screen.getAllByText(today.getDate()).map((e) => e.className)).toContain('rdtDay rdtToday');
    });
  });

  describe('events', () => {
    it('should update internal value when a date is selected', () => {
      const setValueSpy = jest.fn();
      jest.spyOn(React, 'useState').mockReturnValue([ '', setValueSpy ]);
      setup({});

      const value = moment(new Date).startOf('month');

      fireEvent.click(screen.getAllByText('1')[0]);

      expect(setValueSpy).toBeCalled();
      expect(value.isSame(setValueSpy.mock.calls.pop()[0])).toBe(true);
    });

    it('should not update external value when a date is selected', () => {
      const { onCloseSpy, onSaveSpy } = setup({});

      fireEvent.click(screen.getAllByText('1')[0]);

      expect(onCloseSpy).toBeCalledTimes(0);
      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should close modal without value when modal is closed', () => {
      const { onCloseSpy, onSaveSpy } = setup({});

      fireEvent.click(screen.getAllByText('1')[0]);
      fireEvent.click(screen.getByText('cancel'));

      expect(onCloseSpy).toBeCalledTimes(1);
      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should close modal with new value when clicking select button', () => {
      const { onCloseSpy, onSaveSpy } = setup({});

      const value = moment(new Date).startOf('month');

      fireEvent.click(screen.getAllByText('1')[0]);
      fireEvent.click(screen.getByText('save'));

      expect(onSaveSpy).toBeCalledTimes(1);
      expect(value.isSame(onSaveSpy.mock.calls[0][0])).toBe(true);

      expect(onCloseSpy).toBeCalledTimes(0);
    });

    test('is date allowed', () => {
      const isDateAllowedSpy = jest.fn().mockImplementation((date) => date.isBefore(new Date()));

      render(
        <DateTimeModal
          onClose={jest.fn()}
          onSave={jest.fn()}
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:II:SS"
          isDateAllowed={isDateAllowedSpy}
        />
      );

      expect(isDateAllowedSpy).toBeCalledTimes(42);
    });
  });
});
