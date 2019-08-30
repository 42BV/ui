export interface State {
  color: string;
  valid?: boolean;
}

export function getState(meta: {
  invalid?: boolean;
  touched?: boolean;
  validating?: boolean;
}): State {
  if (meta.invalid && meta.touched) {
    return { color: 'danger', valid: false };
  } else if (meta.invalid === false && meta.validating === false) {
    return { color: 'success', valid: true };
  }

  return { color: '', valid: undefined };
}

export function doBlur(onBlur?: () => void): void {
  if (onBlur) {
    onBlur();
  }
}
