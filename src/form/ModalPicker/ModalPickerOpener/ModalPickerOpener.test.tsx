import React from 'react';
import { shallow } from 'enzyme';
import { ModalPickerOpener } from './ModalPickerOpener';
import { adminUser } from '../../../test/fixtures';
import toJson from 'enzyme-to-json';
import * as useComponentOverflow from '../ModalPickerValueTruncator/useComponentOverflow/useComponentOverflow';
import { ButtonAlignment } from '../types';

describe('Component: ModalPickerOpener', () => {
  function setup({
    hasValues = false,
    withTooltip = false,
    alignButton
  }: {
    hasValues?: boolean;
    withTooltip?: boolean;
    alignButton?: ButtonAlignment;
  }) {
    const openModalSpy = jest.fn();
    const onClearSpy = jest.fn();

    const values = hasValues ? adminUser().email : undefined;

    jest
      .spyOn(useComponentOverflow, 'useComponentOverflow')
      .mockImplementation(() => withTooltip);

    const modalPickerOpener = shallow(
      <ModalPickerOpener
        openModal={openModalSpy}
        label="Best friend"
        values={values}
        onClear={onClearSpy}
        alignButton={alignButton}
        displayValues={(value: string) =>
          value ? <span>{value.toUpperCase()}</span> : null
        }
      />
    );

    return { modalPickerOpener, openModalSpy, onClearSpy };
  }

  describe('ui', () => {
    test('without values', () => {
      const { modalPickerOpener } = setup({});
      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => without values'
      );
    });

    test('with values', () => {
      const { modalPickerOpener } = setup({ hasValues: true });
      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => with values'
      );
    });

    test('tooltip', () => {
      const { modalPickerOpener } = setup({
        hasValues: true,
        withTooltip: true
      });

      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => with tooltip'
      );
    });

    test('button aligned right without values', () => {
      const { modalPickerOpener } = setup({ alignButton: 'right' });
      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => button aligned right without values'
      );
    });

    test('button aligned right with values', () => {
      const { modalPickerOpener } = setup({
        hasValues: true,
        alignButton: 'right'
      });
      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => button aligned right with values'
      );
    });

    test('button aligned left without values', () => {
      const { modalPickerOpener } = setup({ alignButton: 'left' });
      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => button aligned left without values'
      );
    });

    test('button aligned left with values', () => {
      const { modalPickerOpener } = setup({
        hasValues: true,
        alignButton: 'left'
      });
      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => button aligned left with values'
      );
    });
  });

  describe('events', () => {
    it('should open the modal when the select button is clicked', () => {
      const { modalPickerOpener, openModalSpy } = setup({});

      // @ts-ignore
      modalPickerOpener
        .find('Button')
        .props()
        // @ts-ignore
        .onClick();

      expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onClear when the clear button is clicked', () => {
      const { modalPickerOpener, onClearSpy } = setup({ hasValues: true });

      // @ts-ignore
      modalPickerOpener
        .find('TextButton')
        .props()
        // @ts-ignore
        .onClick();

      expect(onClearSpy).toHaveBeenCalledTimes(1);
    });
  });
});
