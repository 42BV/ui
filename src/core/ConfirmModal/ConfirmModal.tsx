import React from 'react';
import { OpenCloseModal } from '../OpenCloseModal/OpenCloseModal';
import { t } from '../../utilities/translation/translation';
import { Closeable, UIBasePropsWithCSSPropertiesAndChildren } from '../types';

type ConfirmModalProps = {
  /**
   * The text to show in the heading of the modal. Defaults to "Confirmation"
   *
   * @default Confirmation
   */
  label?: string;

  /**
   * The text to show as the cancel button's text, defaults to "Cancel"
   *
   * @default Cancel
   */
  cancelText?: string;

  /**
   * The text to show as the OK-button's text, defaults to "OK"
   *
   * @default OK
   */
  confirmText?: string;

  /**
   * Function that gets called when the user clicks the save button
   */
  onSave: () => void;
} & Partial<UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode>> &
  Closeable<void, void>;

/**
 * ConfirmModal offers the user a confirmation dialog before performing an operation.
 * The main use case is a delete action, which we want the user to confirm before proceeding.
 *
 * Note: In most cases, you'll want to use {@link ConfirmButton} instead.
 * That component offers an easy-to-use button that triggers this dialog.
 * However, if it is not possible to trigger the action through a button,
 * such as when using a ButtonDropdown, you can use this component directly instead.
 */
export function ConfirmModal({
  onClose,
  onSave,
  label,
  children,
  cancelText,
  confirmText,
  className,
  ...props
}: ConfirmModalProps) {
  return (
    <OpenCloseModal
      {...props}
      onClose={onClose}
      onSave={onSave}
      label={t({
        overrideText: label,
        key: 'ConfirmButton.MODAL_HEADER',
        fallback: 'Confirmation'
      })}
      text={{
        cancel: t({
          overrideText: cancelText,
          key: 'ConfirmButton.CANCEL',
          fallback: 'Cancel'
        }),
        save: t({
          overrideText: confirmText,
          key: 'ConfirmButton.CONFIRM',
          fallback: 'Confirm'
        })
      }}
      className={className}
    >
      {children}
    </OpenCloseModal>
  );
}
