/* istanbul ignore file */

export type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'link'
  | 'muted'
  | 'dark'
  | 'light';

export type BootstrapSize = 'xs' | 'sm' | 'md' | 'lg';

type Side = 'top' | 'right' | 'bottom' | 'left';
type StartOrEnd = 'start' | 'end';
export type TippyPlacement = Side | `${Side}-${StartOrEnd}`;
