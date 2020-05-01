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
    inProgress = undefined
  }: {
    isOpen?: boolean;
    hasLabel?: boolean;
    hasCustomText?: boolean;
    hasButtons?: boolean;
    inProgress?: boolean;
  }) {
    onCloseSpy = jest.fn();
    onSaveSpy = jest.fn();

    const props = {
      isOpen,
      inProgress,
      onClose: onCloseSpy,
      text: hasCustomText
        ? { cancel: 'Stop please', save: 'Select me' }
        : undefined
    };

    if (hasButtons) {
      // @ts-ignore
      props.onSave = onSaveSpy;
    }

    const children = (
      <RadioGroup
        onChange={jest.fn()}
        options={['local', 'development', 'test', 'acceptation', 'production']}
        optionForValue={v => v}
      />
    );

    if (hasLabel) {
      openCloseModal = shallow(
        <OpenCloseModal label="Choose something" {...props}>
          {children}
        </OpenCloseModal>
      );
    } else {
      openCloseModal = shallow(
        <OpenCloseModal {...props}>{children}</OpenCloseModal>
      );
    }
  }

  describe('ui', () => {
    test('with label', () => {
      setup({ isOpen: true });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => with label'
      );
    });

    test('without label', () => {
      setup({ hasLabel: false });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => without label'
      );
    });

    test('without buttons', () => {
      setup({ hasButtons: false });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => without buttons'
      );
    });

    test('custom button texts', () => {
      setup({ hasCustomText: true });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => custom button texts'
      );
    });

    test('in progress', () => {
      setup({ inProgress: true });

      expect(toJson(openCloseModal)).toMatchSnapshot(
        'Component: OpenCloseModal => ui => in progress'
      );
    });
  });

  describe('events', () => {
    it('should call onClose when clicked outside modal', () => {
      setup({});

      // @ts-ignore
      openCloseModal
        .find('Modal')
        .at(0)
        .props()
        // @ts-ignore
        .toggle();

      expect(onCloseSpy).toBeCalledTimes(1);
    });

    it('should call onClose when close button clicked', () => {
      setup({});

      // @ts-ignore
      openCloseModal
        .find('ModalHeader')
        .at(0)
        .props()
        // @ts-ignore
        .toggle();

      expect(onCloseSpy).toBeCalledTimes(1);
    });

    it('should call onClose when cancel button clicked', () => {
      setup({});

      // @ts-ignore
      openCloseModal
        .find('Button')
        .at(0)
        .props()
        // @ts-ignore
        .onClick();

      expect(onCloseSpy).toBeCalledTimes(1);
    });

    it('should call onSave when save button clicked', () => {
      setup({});

      // @ts-ignore
      openCloseModal
        .find('Button')
        .at(1)
        .props()
        // @ts-ignore
        .onClick();

      expect(onSaveSpy).toBeCalledTimes(1);
    });
  });
});
