export type Rule =
  | 'lowercase'
  | 'uppercase'
  | 'number'
  | 'specialChar'
  | 'minimumLength'
  | 'noSpace';

export function hasLowercase(value?: string) {
  return !!value && /(?=.*[a-z])/.test(value);
}

export function hasUppercase(value?: string) {
  return !!value && /(?=.*[A-Z])/.test(value);
}

export function hasNumber(value?: string) {
  return !!value && /(?=.*[0-9])/.test(value);
}

export function hasSpecialChar(value?: string) {
  return !!value && /(?=.*[@#$%^&+=.,?!])/.test(value);
}

export function hasMinimumLength(length: number, value?: string) {
  return !!value && new RegExp(`.{${length},}`).test(value);
}

export function hasNoSpaces(value?: string) {
  return /^\S*$/.test(value ?? '');
}
