import React from 'react';
import { Changeable, UIBasePropsWithCSSPropertiesAndChildren } from '../types';

type CheckBoxProps = {
  checked?: boolean;

  onBlur?: React.FocusEventHandler;

  ariaLabel?: string;
} & Changeable<any, void> &
  Partial<
    Omit<
      UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode>,
      'capture' | 'enterKeyHint' | 'form' | 'list'
    >
  >;

export function CheckBox({ ariaLabel, ...props }: CheckBoxProps) {
  return <input type={'checkbox'} aria-label={ariaLabel} {...props} />;
}
