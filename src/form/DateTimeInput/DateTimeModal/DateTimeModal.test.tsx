import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { DateTimeModal } from './DateTimeModal';

import * as Value from './useValue';

describe('Component: DateTimeModal', () => {
  function setup({ hasValue = false }: { hasValue?: boolean }) {
    const onCloseSpy = jest.fn();
    const onSaveSpy = jest.fn();
    const isDateAllowedSpy = jest.fn();

    const dateTimeModal = shallow(
      <DateTimeModal
        isOpen={true}
        onClose={onCloseSpy}
        onSave={onSaveSpy}
        dateFormat="YYYY-MM-DD"
        timeFormat="HH:II:SS"
        isDateAllowed={isDateAllowedSpy}
        defaultValue={hasValue ? new Date(2020, 1, 1, 0, 0, 0) : undefined}
      />
    );
    return { dateTimeModal, onCloseSpy, onSaveSpy, isDateAllowedSpy };
  }

  describe('ui', () => {
    test('without value', () => {
      const { dateTimeModal } = setup({});

      expect(toJson(dateTimeModal)).toMatchSnapshot(
        'Component: DateTimeModal => ui => without value'
      );
    });

    test('with value', () => {
      const { dateTimeModal } = setup({ hasValue: true });

      expect(toJson(dateTimeModal)).toMatchSnapshot(
        'Component: DateTimeModal => ui => with value'
      );
    });
  });

  describe('events', () => {
    it('should update internal value when a date is selected', () => {
      const setValueSpy = jest.fn();
      const useValueSpy = jest
        .spyOn(Value, 'useValue')
        .mockReturnValue(['', setValueSpy]);
      const { dateTimeModal } = setup({});

      const value = new Date(2020, 2, 1, 0, 0, 0);

      // @ts-ignore
      dateTimeModal
        .find('DateTime')
        .props()
        // @ts-ignore
        .onChange(value);

      expect(setValueSpy).toBeCalledTimes(1);
      expect(setValueSpy).toBeCalledWith(value);

      useValueSpy.mockRestore();
    });

    it('should not update external value when a date is selected', () => {
      const { dateTimeModal, onCloseSpy, onSaveSpy } = setup({});

      const value = new Date(2020, 2, 1, 0, 0, 0);

      // @ts-ignore
      dateTimeModal
        .find('DateTime')
        .props()
        // @ts-ignore
        .onChange(value);

      expect(onCloseSpy).toBeCalledTimes(0);
      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should close modal without value when modal is closed', () => {
      const { dateTimeModal, onCloseSpy, onSaveSpy } = setup({});

      const value = new Date(2020, 2, 1, 0, 0, 0);

      // @ts-ignore
      dateTimeModal
        .find('DateTime')
        .props()
        // @ts-ignore
        .onChange(value);

      // @ts-ignore
      dateTimeModal
        .find('OpenCloseModal')
        .props()
        // @ts-ignore
        .onClose();

      expect(onCloseSpy).toBeCalledTimes(1);
      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should close modal with new value when clicking select button', () => {
      const { dateTimeModal, onCloseSpy, onSaveSpy } = setup({});

      const value = new Date(2020, 2, 1, 0, 0, 0);

      // @ts-ignore
      dateTimeModal
        .find('DateTime')
        .props()
        // @ts-ignore
        .onChange(value);

      // @ts-ignore
      dateTimeModal
        .find('OpenCloseModal')
        .props()
        // @ts-ignore
        .onSave();

      expect(onSaveSpy).toBeCalledTimes(1);
      expect(onSaveSpy).toBeCalledWith(value);

      expect(onCloseSpy).toBeCalledTimes(0);
    });

    test('is date allowed', () => {
      const { dateTimeModal, isDateAllowedSpy } = setup({});

      const value = new Date(2020, 2, 1, 0, 0, 0);
      const current = new Date();

      // @ts-ignore
      dateTimeModal
        .find('DateTime')
        .props()
        // @ts-ignore
        .isValidDate(value, current);

      expect(isDateAllowedSpy).toBeCalledTimes(1);
      expect(isDateAllowedSpy).toBeCalledWith(value, current);
    });
  });
});
