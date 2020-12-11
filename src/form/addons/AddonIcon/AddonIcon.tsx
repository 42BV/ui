import React from 'react';
import { Icon, IconType } from '../../..';

import { Addon, Props as AddonProps } from '../Addon/Addon';

export type Props = Omit<AddonProps, 'children'> & {
  icon: IconType;
};

/**
 * Defines an addon to use with an Input element which is a readonly
 * Icon.
 */
export function AddonIcon({ icon, className, position }: Props) {
  return (
    <Addon className={className} position={position}>
      <Icon icon={icon} />
    </Addon>
  );
}
