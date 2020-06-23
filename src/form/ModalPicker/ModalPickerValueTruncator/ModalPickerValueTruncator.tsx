import React, { useRef } from 'react';
import Tooltip from '../../../core/Tooltip/Tooltip';
import { OptionForValue } from '../../option';
import { useComponentOverflow } from './useComponentOverflow/useComponentOverflow';

export type Props<T> = {
  values: T | T[];
  optionForValue: OptionForValue<T>;
};

export function ModalPickerValueTruncator<T>({
  values,
  optionForValue
}: Props<T>) {
  const ref = useRef<HTMLElement>(null);
  const isOverflowing = useComponentOverflow(ref, values);

  if (!values) {
    return null;
  }

  const text = Array.isArray(values) ? (
    <>{values.map(optionForValue).join(', ')}</>
  ) : (
    optionForValue(values)
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
