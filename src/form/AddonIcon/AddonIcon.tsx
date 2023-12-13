import { Icon, IconType } from '../../core/Icon';

import { InputGroupText } from 'reactstrap';

export type Props = {
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
export function AddonIcon({ icon, className }: Props) {
  return (
    <InputGroupText>
      <Icon icon={icon} className={className} />
    </InputGroupText>
  );
}
