import React, { Suspense } from 'react';
import {
  Modal as ReactstrapModal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import {
  BootstrapSize,
  Closeable,
  UIBasePropsWithCSSProperties,
  WithChildren,
  WithFooter,
  WithHeader,
  WithSize
} from '../types';
import { Loading } from '../Loading/Loading';

type ModalProps = {
  /**
   * Whether the footer should stick to the bottom of the modal.
   * This allows the user to always click the close and save buttons.
   *
   * Defaults to `true`.
   */
  stickyFooter?: boolean;

  /**
   * Optional extra CSS class you want to add to the <ModalHeader>.
   * Useful for styling the component.
   */
  modalHeaderClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <ModalBody>.
   * Useful for styling the component.
   */
  modalBodyClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <ModalFooter>.
   * Useful for styling the component.
   */
  modalFooterClassName?: string;
} & Partial<
  UIBasePropsWithCSSProperties &
    WithSize<BootstrapSize> &
    WithHeader<React.ReactNode> &
    WithFooter<React.ReactNode>
> &
  WithChildren<React.ReactNode> &
  Closeable<unknown, void>;

/**
 * Modal is a dialog that overlays the website. The dialog is often used to
 * ask the user a question or inform the user about something important.
 * You should use this component over the reactstrap Modal component,
 * because this component has Suspense built in to display a loader
 * and wait for its content to be fully loaded before displaying.
 */
export function Modal(props: ModalProps) {
  const {
    onClose,
    header,
    footer,
    size,
    stickyFooter = true,
    className,
    modalHeaderClassName,
    modalBodyClassName,
    modalFooterClassName,
    children
  } = props;

  return (
    <ReactstrapModal
      wrapClassName={stickyFooter ? 'sticky-modal' : undefined}
      isOpen={true}
      toggle={onClose}
      size={size}
      className={className}
    >
      {header ? (
        <ModalHeader toggle={onClose} className={modalHeaderClassName}>
          <Suspense fallback={<Loading />}>{header}</Suspense>
        </ModalHeader>
      ) : null}
      <ModalBody className={modalBodyClassName}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </ModalBody>
      {footer ? (
        <ModalFooter className={modalFooterClassName}>
          <Suspense fallback={<Loading />}>{footer}</Suspense>
        </ModalFooter>
      ) : null}
    </ReactstrapModal>
  );
}
