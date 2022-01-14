import React from 'react';
import { Icon, IconType } from '../../..';

import { Addon, Props as AddonProps } from '../Addon/Addon';
import { InputGroupText } from 'reactstrap';

export type Props = Omit<AddonProps, 'children'> & {
  icon: IconType;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * Defines an addon to use with an Input element which is a readonly
 * Icon.
 */
export function AddonIcon({ icon, className, position }: Props) {
  return (
    <Addon position={position}>
      <InputGroupText>
        <Icon icon={icon} className={className} />
      </InputGroupText>
    </Addon>
  );
}
