import React, { Suspense, useState } from 'react';
import { OpenClose } from '../OpenClose/OpenClose';
import { Card, CardHeader } from 'reactstrap';
import classNames from 'classnames';
import { Loading } from '../Loading/Loading';
import {
  UIBasePropsWithCSSProperties,
  WithChildren,
  WithHeader
} from '../types';

type CardOpenCloseProps = {
  isOpen?: boolean;

  /**
   * Callback that is triggered when the header is clicked. May not flip the value of the isOpen-property.
   * The Callback-function is called just before the isOpen-property is flipped.
   */
  toggle: () => void;
} & Partial<UIBasePropsWithCSSProperties> &
  WithHeader<React.ReactNode> &
  WithChildren<() => React.ReactNode>;

/**
 * CardOpenClose is a collapsable bootstrap card that you can use to only display
 * important details and hide other details in a collapsable body to prevent extra
 * long pages that cause the user to scroll a lot.
 */
export function CardOpenClose(props: CardOpenCloseProps) {
  const { header, className, children, toggle } = props;
  const [isOpen, setIsOpen] = useState(props.isOpen === true);

  function onClick() {
    toggle();
    setIsOpen(!isOpen);
  }

  return (
    <Card className={classNames('my-2', className)}>
      <CardHeader
        className="d-flex justify-content-between align-content-center clickable"
        onClick={onClick}
      >
        {header}
        <OpenClose open={isOpen} />
      </CardHeader>

      {!isOpen ? null : (
        <Suspense fallback={<Loading />}>{children()}</Suspense>
      )}
    </Card>
  );
}
