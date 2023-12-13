import { ReactNode, Suspense } from 'react';
import { OpenClose } from '../../core/OpenClose/OpenClose';
import { Card, CardHeader, CardProps } from 'reactstrap';
import classNames from 'classnames';
import { Loading } from '../../core/Loading/Loading';

type Props = CardProps & {
  /**
   * The important details you always want to be displayed.
   */
  header: ReactNode;

  /**
   * Whether the collapsable body is opened.
   */
  isOpen: boolean;

  /**
   * Callback that is triggered when the header is clicked.
   * It should invert the isOpen property to show or hide the collapsable body.
   */
  toggle: () => void;
};

/**
 * CardOpenClose is a collapsable bootstrap card that you can use to only display
 * important details and hide other details in a collapsable body to prevent extra
 * long pages that cause the user to scroll a lot.
 */
export function CardOpenClose({
  header,
  isOpen,
  toggle,
  className,
  children,
  ...cardProps
}: Readonly<Props>) {
  return (
    <Card {...cardProps} className={classNames('my-2', className)}>
      <CardHeader
        className="d-flex justify-content-between align-content-center clickable"
        onClick={toggle}
      >
        {header}

        <OpenClose open={isOpen} />
      </CardHeader>

      {!isOpen ? null : <Suspense fallback={<Loading />}>{children}</Suspense>}
    </Card>
  );
}
