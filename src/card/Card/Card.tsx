import { ReactNode, Suspense } from 'react';
import {
  Card as ReactstrapCard,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps
} from 'reactstrap';
import { Loading } from '../../core/Loading/Loading';
import { ErrorBoundary } from 'react-error-boundary';
import { ContentState } from '../../core/ContentState/ContentState';
import { t } from '../../utilities/translation/translation';

export type Props = CardProps & {
  /**
   * Optionally the content of the card header.
   */
  header?: ReactNode;

  /**
   * Optionally the content of the card footer.
   */
  footer?: ReactNode;

  /**
   * Optional extra CSS class you want to add to the <CardHeader>.
   * Useful for styling the component.
   */
  cardHeaderClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <CardBody>.
   * Useful for styling the component.
   */
  cardBodyClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <CardFooter>.
   * Useful for styling the component.
   */
  cardFooterClassName?: string;
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
  cardHeaderClassName,
  cardBodyClassName,
  cardFooterClassName,
  ...cardProps
}: Readonly<Props>) {
  return (
    <ReactstrapCard {...cardProps}>
      {header ? (
        <CardHeader className={cardHeaderClassName}>
          <Suspense fallback={<Loading />}>{header}</Suspense>
        </CardHeader>
      ) : null}
      <CardBody className={cardBodyClassName}>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary
            fallback={
              <ContentState
                mode="error"
                title={t({
                  key: 'Card.ERROR',
                  fallback: 'Oops, something went wrong!'
                })}
              />
            }
          >
            {children}
          </ErrorBoundary>
        </Suspense>
      </CardBody>
      {footer ? (
        <CardFooter className={cardFooterClassName}>
          <Suspense fallback={<Loading />}>{footer}</Suspense>
        </CardFooter>
      ) : null}
    </ReactstrapCard>
  );
}
