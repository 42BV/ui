import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ConfirmModal } from './ConfirmModal';

describe('Component: ConfirmModal', () => {
  describe('ui', () => {
    test('default texts', () => {
      render(
        <ConfirmModal onClose={() => undefined} onSave={() => undefined}>
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        </ConfirmModal>
      );

      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('custom texts', () => {
      render(
        <ConfirmModal
          onClose={() => undefined}
          onSave={() => undefined}
          cancelText="NO"
          confirmText="YES"
          label="Perform dangerous action"
        >
          <p>
            Are you sure you want to <strong>delete</strong> all users in the
            database?
          </p>
        </ConfirmModal>
      );

      expect(screen.queryByText('Confirmation')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Perform dangerous action')
      ).toBeInTheDocument();
      expect(screen.getAllByRole('button')[1]).toHaveTextContent('cancelNO');
      expect(screen.getAllByRole('button')[2]).toHaveTextContent('saveYES');
      expect(document.body.lastChild).toMatchSnapshot();
    });
  });

  describe('events', () => {
    type Props = { text: string; isOpen?: boolean };

    function setup({ text, isOpen }: Props) {
      const onCloseSpy = jest.fn();
      const onSaveSpy = jest.fn();

      const props = {
        isOpen: isOpen ?? false,
        onClose: onCloseSpy,
        onSave: onSaveSpy,
        label: 'Are you sure you want a ConfirmAction?',
        children: text
      };

      const { container } = render(<ConfirmModal {...props} />);

      return { container, onCloseSpy, onSaveSpy };
    }

    it('should open the OpenCloseModal when the ConfirmModal is opened', () => {
      setup({
        text: 'Delete all data in the database?',
        isOpen: true
      });

      expect(
        screen.queryByText('Delete all data in the database?')
      ).toBeInTheDocument();
    });

    it('should call onClose when the Modal is closed', () => {
      const { onCloseSpy, onSaveSpy } = setup({
        text: 'Delete this user and all his data?',
        isOpen: true
      });

      fireEvent.click(screen.getByLabelText('Close'));

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
      expect(onSaveSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onClose when the cancel button is clicked', () => {
      const { onCloseSpy, onSaveSpy } = setup({
        text: 'Delete this user and all his data?',
        isOpen: true
      });

      fireEvent.click(screen.getByText('cancel'));

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
      expect(onSaveSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onSave when the Modal is confirmed', () => {
      const { onCloseSpy, onSaveSpy } = setup({
        text: 'Delete this user and all his data?',
        isOpen: true
      });

      fireEvent.click(screen.getByText('save'));

      expect(onCloseSpy).toHaveBeenCalledTimes(0);
      expect(onSaveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
