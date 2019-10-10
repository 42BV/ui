export interface State {
  color: string;
  valid?: boolean;
}

export function getState(info: {
  hasErrors: boolean;
  touched?: boolean;
}): State {
  if (info.hasErrors && info.touched) {
    return { color: 'danger', valid: false };
  } else {
    return { color: '', valid: undefined };
  }
}

export function doBlur(onBlur?: () => void): void {
  if (onBlur) {
    onBlur();
  }
}
