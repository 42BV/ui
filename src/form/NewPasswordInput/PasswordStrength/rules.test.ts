import { hasLowercase, hasMinimumLength, hasNoSpaces, hasNumber, hasSpecialChar, hasUppercase } from './rules';

test('hasLowercase', () => {
  expect(hasLowercase(undefined)).toBe(false);
  expect(hasLowercase('')).toBe(false);
  expect(hasLowercase('lowercase')).toBe(true);
});

test('hasUppercase', () => {
  expect(hasUppercase(undefined)).toBe(false);
  expect(hasUppercase('')).toBe(false);
  expect(hasUppercase('UPPERCASE')).toBe(true);
});

test('hasNumber', () => {
  expect(hasNumber(undefined)).toBe(false);
  expect(hasNumber('')).toBe(false);
  expect(hasNumber('12345678')).toBe(true);
});

test('hasMinimumLength', () => {
  expect(hasMinimumLength(10, undefined)).toBe(false);
  expect(hasMinimumLength(10, '')).toBe(false);
  expect(hasMinimumLength(10, 'longenough')).toBe(true);
});

test('hasSpecialChar', () => {
  expect(hasSpecialChar(undefined)).toBe(false);
  expect(hasSpecialChar('')).toBe(false);
  expect(hasSpecialChar('!@#$%^&*')).toBe(true);
});

test('hasNoSpaces', () => {
  expect(hasNoSpaces(undefined)).toBe(true);
  expect(hasNoSpaces('with a space')).toBe(false);
  expect(hasNoSpaces('withoutspace')).toBe(true);
});
