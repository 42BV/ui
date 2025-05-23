import React, { Suspense } from 'react';
import { OpenClose } from '../OpenClose/OpenClose';
import { Card, CardHeader } from 'reactstrap';
import classNames from 'classnames';
import { Loading } from '../Loading/Loading';

type Props = {
  /**
   * The important details you always want to be displayed.
   */
  header: React.ReactNode;

  /**
   * Whether the collapsable body is opened.
   */
  isOpen: boolean;

  /**
   * Callback that is triggered when the header is clicked.
   * It should invert the isOpen property to show or hide the collapsable body.
   */
  toggle: () => void;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * The content that might be hidden in the collapsable body.
   */
  children: () => React.ReactNode;
};

/**
 * CardOpenClose is a collapsable bootstrap card that you can use to only display
 * important details and hide other details in a collapsable body to prevent extra
 * long pages that cause the user to scroll a lot.
 */
export function CardOpenClose(props: Props) {
  const { header, isOpen, toggle, className } = props;

  return (
    <Card className={classNames('my-2', className)}>
      <CardHeader
        className="d-flex justify-content-between align-content-center clickable"
        onClick={toggle}
        tabIndex={0}
        role="button"
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.code === 'Space') {
            toggle();
          }
        }}
      >
        {header}

        <OpenClose open={isOpen} />
      </CardHeader>

      {!isOpen ? null : (
        <Suspense fallback={<Loading />}>{props.children()}</Suspense>
      )}
    </Card>
  );
}
