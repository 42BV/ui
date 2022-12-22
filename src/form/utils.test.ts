import { alwaysTrue, doBlur, getState } from './utils';
import { vi } from 'vitest';

test('getState', () => {
  expect(getState({ hasErrors: true, touched: true })).toEqual({
    color: 'danger',
    valid: false
  });

  expect(getState({ hasErrors: true, touched: false })).toEqual({
    color: '',
    valid: undefined
  });

  expect(getState({ hasErrors: false, touched: false })).toEqual({
    color: '',
    valid: undefined
  });

  expect(getState({ hasErrors: false, touched: undefined })).toEqual({
    color: '',
    valid: undefined
  });
});

test('doBlur', () => {
  const onBlur = vi.fn();
  doBlur(onBlur);
  expect(onBlur).toBeCalledTimes(1);
});

test('alwaysTrue', () => {
  expect(alwaysTrue()).toBe(true);
  expect(alwaysTrue()).toBe(true);
  expect(alwaysTrue()).toBe(true);
  expect(alwaysTrue()).toBe(true);
  expect(alwaysTrue()).toBe(true);
  expect(alwaysTrue()).toBe(true);
});
