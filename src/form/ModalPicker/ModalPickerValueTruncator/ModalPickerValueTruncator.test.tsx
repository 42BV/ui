import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ModalPickerValueTruncator } from './ModalPickerValueTruncator';
import { adminUser, userUser } from '../../../test/fixtures';
import * as ComponentOverflow from './useComponentOverflow/useComponentOverflow';

describe('Component: ModalPickerValueTruncator', () => {
  function setup({
    hasSingleValue = false,
    hasMultipleValues = false
  }: {
    hasSingleValue?: boolean;
    hasMultipleValues?: boolean;
  }) {
    const labelForOptionSpy = jest.fn((user) => user.email);

    const value = hasSingleValue
      ? userUser()
      : hasMultipleValues
      ? [adminUser(), userUser()]
      : undefined;

    const modalPickerValueTruncator = shallow(
      <ModalPickerValueTruncator
        value={value}
        labelForOption={labelForOptionSpy}
      />
    );

    return { modalPickerValueTruncator, labelForOptionSpy };
  }

  describe('ui', () => {
    test('no value', () => {
      const { modalPickerValueTruncator } = setup({});
      expect(toJson(modalPickerValueTruncator)).toMatchSnapshot(
        'Component: ModalPickerValueTruncator => ui => no value'
      );
    });

    test('single value', () => {
      const { modalPickerValueTruncator } = setup({ hasSingleValue: true });
      expect(toJson(modalPickerValueTruncator)).toMatchSnapshot(
        'Component: ModalPickerValueTruncator => ui => single value'
      );
    });

    test('mutliple values', () => {
      const { modalPickerValueTruncator } = setup({ hasMultipleValues: true });
      expect(toJson(modalPickerValueTruncator)).toMatchSnapshot(
        'Component: ModalPickerValueTruncator => ui => multiple values'
      );
    });

    test('overflowing', () => {
      jest
        .spyOn(ComponentOverflow, 'useComponentOverflow')
        .mockReturnValue(true);
      const { modalPickerValueTruncator } = setup({ hasMultipleValues: true });
      expect(toJson(modalPickerValueTruncator)).toMatchSnapshot(
        'Component: ModalPickerValueTruncator => ui => overflowing'
      );
    });
  });
});
