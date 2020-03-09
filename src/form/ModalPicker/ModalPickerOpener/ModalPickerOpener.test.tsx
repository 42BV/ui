import React from 'react';
import { shallow } from 'enzyme';
import { ModalPickerOpener } from './ModalPickerOpener';
import { adminUser } from '../../../test/fixtures';
import toJson from 'enzyme-to-json';
import * as useComponentOverflow from './useComponentOverflow/useComponentOverflow';

describe('Component: ModalPickerOpener', () => {
  function setup({
    hasValues = false,
    withTooltip = false
  }: {
    hasValues?: boolean;
    withTooltip?: boolean;
  }) {
    const openModalSpy = jest.fn();
    const values = hasValues ? adminUser.email : undefined;

    jest
      .spyOn(useComponentOverflow, 'useComponentOverflow')
      .mockImplementation(() => withTooltip);

    const modalPickerOpener = shallow(
      <ModalPickerOpener
        openModal={openModalSpy}
        label="Best friend"
        values={values}
      />
    );

    return { modalPickerOpener, openModalSpy };
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
  });
});
