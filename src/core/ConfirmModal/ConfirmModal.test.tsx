import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import ConfirmModal from './ConfirmModal';

describe('Component: ConfirmModal', () => {
  describe('ui', () => {
    test('default texts', () => {
      const confirmAction = shallow(
        <ConfirmModal
          isOpen={true}
          onClose={() => undefined}
          onSave={() => undefined}
          modalText={
            <p>
              Are you sure you want to <strong>delete</strong> the user?
            </p>
          }
        />
      );

      expect(toJson(confirmAction)).toMatchSnapshot(
        'Component: ConfirmModal => ui => default texts'
      );
    });

    test('custom texts', () => {
      const confirmAction = shallow(
        <ConfirmModal
          isOpen={true}
          onClose={() => undefined}
          onSave={() => undefined}
          modalText={
            <p>
              Are you sure you want to <strong>delete</strong> all users in the
              database?
            </p>
          }
          cancelText="NO"
          confirmText="YES"
          label="Perform dangerous action"
        />
      );

      expect(toJson(confirmAction)).toMatchSnapshot(
        'Component: ConfirmModal => ui => custom texts'
      );
    });
  });

  describe('events - onClose and onSave', () => {
    let confirmModal: ShallowWrapper;
    let onCloseSpy: jest.Mock;
    let onSaveSpy: jest.Mock;

    type Props = { text: string };

    function setup({ text }: Props) {
      onCloseSpy = jest.fn();
      onSaveSpy = jest.fn();

      const props = {
        isOpen: false,
        onClose: onCloseSpy,
        onSave: onSaveSpy,
        label: 'Are you sure you want a ConfirmAction?',
        modalText: text
      };

      confirmModal = shallow(<ConfirmModal {...props} />);
    }

    function openModal() {
      confirmModal = confirmModal.setProps({ isOpen: true });

      // @ts-ignore
      expect(confirmModal.find('OpenCloseModal').props().isOpen).toBe(true);
    }

    it('should open the OpenCloseModal when the ConfirmModal is opened', () => {
      setup({
        text: 'Delete all data in the database?'
      });

      confirmModal = confirmModal.setProps({ isOpen: true });

      // @ts-ignore
      expect(confirmModal.find('OpenCloseModal').props().isOpen).toBe(true);
    });

    it('should call onClose when the Modal is closed', () => {
      setup({
        text: 'Delete this user and all his data?'
      });

      openModal();

      // @ts-ignore
      confirmModal.find('OpenCloseModal').prop('onClose')();

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onSave when the Modal is confirmed', () => {
      setup({
        text: 'Delete this note?'
      });

      openModal();

      // @ts-ignore
      confirmModal
        .find('OpenCloseModal')
        // @ts-ignore
        .prop('onSave')();

      expect(onSaveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
