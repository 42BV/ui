import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import RadioGroup from '../../form/RadioGroup/RadioGroup';

import { OpenCloseModal } from './OpenCloseModal';

describe('Component: OpenCloseModal', () => {
  let openCloseModal: ShallowWrapper;
  let onCloseSpy: jest.Mock;
  let onSaveSpy: jest.Mock;

  function setup({
    isOpen = false,
    hasLabel = true,
    hasCustomText = false,
    hasButtons = true,
    inProgress = undefined,
    stickyFooter = undefined
  }: {
    isOpen?: boolean;
    hasLabel?: boolean;
    hasCustomText?: boolean;
    hasButtons?: boolean;
    inProgress?: boolean;
    stickyFooter?: boolean;
  }) {
    onCloseSpy = jest.fn();
    onSaveSpy = jest.fn();

    const props = {
      isOpen,
      inProgress,
      stickyFooter,
      onClose: onCloseSpy,
      text: hasCustomText
        ? { cancel: 'Stop please', save: 'Select me' }
        : undefined,
      label: hasLabel ? 'Choose something' : undefined,
      onSave: hasButtons ? onSaveSpy : undefined
    };

    const children = (
      <RadioGroup<string>
        onChange={jest.fn()}
        options={['local', 'development', 'test', 'acceptation', 'production']}
        labelForOption={(v) => v}
      />
    );

    openCloseModal = shallow(
      <OpenCloseModal {...props}>{children}</OpenCloseModal>
    );
  }

  describe('ui', () => {
    test('not open', () => {
      setup({ isOpen: false });

      expect(toJson(openCloseModal)).toBe('');
    });

    test('with label', () => {
      setup({ isOpen: true });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => with label'
      );
    });

    test('without label', () => {
      setup({ isOpen: true, hasLabel: false });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => without label'
      );
    });

    test('without buttons', () => {
      setup({ isOpen: true, hasButtons: false });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => without buttons'
      );
    });

    test('custom button texts', () => {
      setup({ isOpen: true, hasCustomText: true });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => custom button texts'
      );
    });

    test('in progress', () => {
      setup({ isOpen: true, inProgress: true });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => in progress'
      );
    });

    test('sans sticky footer', () => {
      setup({ isOpen: true, stickyFooter: false });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => sans sticky'
      );
    });
  });

  describe('events', () => {
    it('should call onClose when cancel button clicked', () => {
      setup({ isOpen: true });

      openCloseModal
        .find('Modal')
        .props()
        // @ts-expect-error Test mock
        .footer.props.children[0].props.onClick();

      expect(onCloseSpy).toBeCalledTimes(1);
    });

    it('should call onSave when save button clicked', () => {
      setup({ isOpen: true });

      openCloseModal
        .find('Modal')
        .props()
        // @ts-expect-error Test mock
        .footer.props.children[1].props.onClick();

      expect(onSaveSpy).toBeCalledTimes(1);
    });
  });
});
