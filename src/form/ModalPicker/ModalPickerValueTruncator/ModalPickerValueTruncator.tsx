import React, { useRef } from 'react';
import { Tooltip } from '../../../core/Tooltip/Tooltip';
import { LabelForOption } from '../../option';
import { useComponentOverflow } from './useComponentOverflow/useComponentOverflow';

export type Props<T> = {
  value: T | T[];
  labelForOption: LabelForOption<T>;
};

export function ModalPickerValueTruncator<T>({
  value,
  labelForOption
}: Props<T>) {
  const ref = useRef<HTMLElement>(null);
  const isOverflowing = useComponentOverflow(ref, value);

  if (!value) {
    return null;
  }

  const text = Array.isArray(value) ? (
    <>{value.map(labelForOption).join(', ')}</>
  ) : (
    labelForOption(value)
  );

  return (
    <span className="text-truncate position-relative" ref={ref}>
      {isOverflowing ? (
        <Tooltip
          content={text}
          className="w-100 h-100 position-absolute"
          tag="div"
        >
          {' '}
        </Tooltip>
      ) : null}
      {text}
    </span>
  );
}
