import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ConfirmModal } from './ConfirmModal';

describe('Component: ConfirmModal', () => {
  describe('ui', () => {
    test('default texts', () => {
      render(
        <ConfirmModal
          onClose={() => undefined}
          onSave={() => undefined}
          modalText={
            <p>
              Are you sure you want to <strong>delete</strong> the user?
            </p>
          }
        />
      );

      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('custom texts', async () => {
      expect.assertions(4);

      render(
        <ConfirmModal
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

      expect(screen.queryByText('Confirmation')).toBeNull();
      await screen.findByText('Perform dangerous action');
      expect(screen.getAllByRole('button')[1].textContent).toEqual('cancelNO');
      expect(screen.getAllByRole('button')[2].textContent).toEqual('saveYES');
      expect(document.body.lastChild).toMatchSnapshot();
    });
  });

  describe('events', () => {
    type Props = { text: string; isOpen?: boolean };

    function setup({ text, isOpen }: Props) {
      const onCloseSpy = vi.fn();
      const onSaveSpy = vi.fn();

      const props = {
        isOpen: isOpen ?? false,
        onClose: onCloseSpy,
        onSave: onSaveSpy,
        label: 'Are you sure you want a ConfirmAction?',
        modalText: text
      };

      const { container } = render(<ConfirmModal {...props} />);

      return { container, onCloseSpy, onSaveSpy };
    }

    it('should open the OpenCloseModal when the ConfirmModal is opened', async () => {
      expect.assertions(0);

      setup({
        text: 'Delete all data in the database?',
        isOpen: true
      });

      await screen.findByText('Delete all data in the database?');
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
