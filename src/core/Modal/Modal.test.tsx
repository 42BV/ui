import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import RadioGroup from '../../form/RadioGroup/RadioGroup';

import { Modal } from './Modal';

describe('Component: Modal', () => {
  let modal: ShallowWrapper;
  let onCloseSpy: jest.Mock;

  function setup({
    hasHeader = true,
    hasFooter = true,
    stickyFooter = undefined
  }: {
    hasHeader?: boolean;
    hasFooter?: boolean;
    stickyFooter?: boolean;
  }) {
    onCloseSpy = jest.fn();

    const props = {
      stickyFooter,
      onClose: onCloseSpy,
      header: hasHeader ? 'Header text' : undefined,
      footer: hasFooter ? 'Footer text' : undefined
    };

    const children = (
      <RadioGroup<string>
        onChange={jest.fn()}
        options={['local', 'development', 'test', 'acceptation', 'production']}
        labelForOption={(v) => v}
      />
    );

    modal = shallow(<Modal {...props}>{children}</Modal>);
  }

  describe('ui', () => {
    test('with header and footer', () => {
      setup({});

      expect(toJson(modal)).toMatchSnapshot(
        'Component: Modal => ui => with header and footer'
      );
    });

    test('without header', () => {
      setup({ hasHeader: false });

      expect(toJson(modal)).toMatchSnapshot(
        'Component: Modal => ui => without header'
      );
    });

    test('without footer', () => {
      setup({ hasFooter: false });

      expect(toJson(modal)).toMatchSnapshot(
        'Component: Modal => ui => without footer'
      );
    });

    test('sans sticky footer', () => {
      setup({ stickyFooter: false });

      expect(toJson(modal)).toMatchSnapshot(
        'Component: Modal => ui => sans sticky'
      );
    });
  });

  describe('events', () => {
    it('should call onClose when clicked outside modal', () => {
      setup({});

      modal
        .find('Modal')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .toggle();

      expect(onCloseSpy).toBeCalledTimes(1);
    });

    it('should call onClose when close button clicked', () => {
      setup({});

      modal
        .find('ModalHeader')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .toggle();

      expect(onCloseSpy).toBeCalledTimes(1);
    });
  });
});
