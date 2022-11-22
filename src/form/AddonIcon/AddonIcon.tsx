import React from 'react';
import { Icon } from '../../core/Icon';
import { IconProps } from '../../core/types';

import { InputGroupText } from 'reactstrap';

/**
 * Defines an addon to use with an Input element which is a readonly
 * Icon.
 */
export function AddonIcon({
  icon,
  className
}: Pick<IconProps, 'icon' | 'className'>) {
  return (
    <InputGroupText>
      <Icon icon={icon} className={className} />
    </InputGroupText>
  );
}
