export function hasLowercase(value?: string): boolean {
  return !!value && /(?=.*[a-z])/.test(value);
}

export function hasUppercase(value?: string): boolean {
  return !!value && /(?=.*[A-Z])/.test(value);
}

export function hasNumber(value?: string): boolean {
  return !!value && /(?=.*[0-9])/.test(value);
}

export function hasSpecialChar(value?: string): boolean {
  return !!value && /(?=.*[@#$%^&+=.,?!])/.test(value);
}

export function hasMinimumLength(length: number, value?: string): boolean {
  return !!value && new RegExp(`.{${length},}`).test(value);
}

export function hasNoSpaces(value?: string): boolean {
  return /^\S*$/.test(value ?? '');
}
