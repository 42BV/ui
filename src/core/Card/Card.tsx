import React, { CSSProperties, Suspense } from 'react';
import {
  Card as ReactstrapCard,
  CardBody,
  CardFooter,
  CardHeader
} from 'reactstrap';
import { Loading } from '../Loading/Loading';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import {
  UIBasePropsWithCSSPropertiesAndChildren,
  WithFooter,
  WithHeader
} from '../types';

export type Props = {
  /**
   * Optional extra CSS class you want to add to the <CardHeader>.
   * Useful for styling the component.
   */
  cardHeaderClassName?: string;

  cardHeaderStyle?: CSSProperties;

  /**
   * Optional extra CSS class you want to add to the <CardBody>.
   * Useful for styling the component.
   */
  cardBodyClassName?: string;

  cardBodyStyle?: CSSProperties;

  /**
   * Optional extra CSS class you want to add to the <CardFooter>.
   * Useful for styling the component.
   */
  cardFooterClassName?: string;

  cardFooterStyle?: CSSProperties;
} & Partial<
  UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode> &
    WithHeader<React.ReactNode> &
    WithFooter<React.ReactNode>
>;

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
  cardHeaderClassName,
  cardBodyClassName,
  cardFooterClassName,
  cardHeaderStyle,
  cardBodyStyle,
  cardFooterStyle,
  ...props
}: Props) {
  return (
    <ReactstrapCard className={className} {...props}>
      {header ? (
        <CardHeader className={cardHeaderClassName} style={cardHeaderStyle}>
          <Suspense fallback={<Loading />}>{header}</Suspense>
        </CardHeader>
      ) : null}
      <CardBody className={cardBodyClassName} style={cardBodyStyle}>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary>
            <>{children}</>
          </ErrorBoundary>
        </Suspense>
      </CardBody>
      {footer ? (
        <CardFooter className={cardFooterClassName} style={cardFooterStyle}>
          <Suspense fallback={<Loading />}>{footer}</Suspense>
        </CardFooter>
      ) : null}
    </ReactstrapCard>
  );
}
