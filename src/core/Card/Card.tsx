import React, { Suspense } from 'react';
import {
  Card as ReactstrapCard,
  CardBody,
  CardFooter,
  CardHeader
} from 'reactstrap';
import Loading from '../Loading/Loading';

export type Props = {
  /**
   * Optionally the content of the card header.
   */
  header?: React.ReactNode;

  /**
   * Optionally the content of the card footer.
   */
  footer?: React.ReactNode;

  /**
   * The content of the card body.
   */
  children: React.ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional extra CSS class you want to add to the <CardHeader>.
   * Useful for styling the component.
   */
  modalHeaderClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <CardBody>.
   * Useful for styling the component.
   */
  modalBodyClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <CardFooter>.
   * Useful for styling the component.
   */
  modalFooterClassName?: string;
};

/**
 * Card is a content container with an optional header and footer.
 * You should use this component over the reactstrap Card component,
 * because this component has Suspense built in to display a loader
 * and wait for its content to be fully loaded before displaying.
 */
export function Card({
  header,
  footer,
  children,
  className,
  modalHeaderClassName,
  modalBodyClassName,
  modalFooterClassName
}: Props) {
  return (
    <ReactstrapCard className={className}>
      {header ? (
        <CardHeader className={modalHeaderClassName}>
          <Suspense fallback={<Loading />}>{header}</Suspense>
        </CardHeader>
      ) : null}
      <CardBody className={modalBodyClassName}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </CardBody>
      {footer ? (
        <CardFooter className={modalFooterClassName}>
          <Suspense fallback={<Loading />}>{footer}</Suspense>
        </CardFooter>
      ) : null}
    </ReactstrapCard>
  );
}
