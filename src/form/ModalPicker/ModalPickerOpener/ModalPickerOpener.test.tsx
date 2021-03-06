import React from 'react';
import { shallow } from 'enzyme';
import { ModalPickerOpener } from './ModalPickerOpener';
import { adminUser } from '../../../test/fixtures';
import toJson from 'enzyme-to-json';
import * as useComponentOverflow from '../ModalPickerValueTruncator/useComponentOverflow/useComponentOverflow';
import { ModalPickerButtonAlignment } from '../types';

describe('Component: ModalPickerOpener', () => {
  function setup({
    hasValue = false,
    hasIcon = false,
    withTooltip = false,
    alignButton
  }: {
    hasValue?: boolean;
    hasIcon?: boolean;
    withTooltip?: boolean;
    alignButton?: ModalPickerButtonAlignment;
  }) {
    const openModalSpy = jest.fn();
    const onClearSpy = jest.fn();

    const value = hasValue ? adminUser().email : undefined;
    const icon = hasIcon ? 'face' : undefined;

    jest
      .spyOn(useComponentOverflow, 'useComponentOverflow')
      .mockImplementation(() => withTooltip);

    const modalPickerOpener = shallow(
      <ModalPickerOpener
        openModal={openModalSpy}
        label="Best friend"
        icon={icon}
        value={value}
        onClear={onClearSpy}
        alignButton={alignButton}
        renderValue={(value: string) =>
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
      const { modalPickerOpener } = setup({ hasValue: true });
      expect(toJson(modalPickerOpener)).toMatchSnapshot(
        'Component: ModalPickerOpener => ui => with values'
      );
    });

    test('with icon', () => {
      const { modalPickerOpener } = setup({ hasIcon: true });
      expect(modalPickerOpener.find('Button').find('Icon').exists()).toBe(true);
    });

    test('tooltip', () => {
      const { modalPickerOpener } = setup({
        hasValue: true,
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
        hasValue: true,
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
        hasValue: true,
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

      // @ts-expect-error Test mock
      modalPickerOpener
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onClear when the clear button is clicked', () => {
      const { modalPickerOpener, onClearSpy } = setup({ hasValue: true });

      // @ts-expect-error Test mock
      modalPickerOpener
        .find('TextButton')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(onClearSpy).toHaveBeenCalledTimes(1);
    });
  });
});
