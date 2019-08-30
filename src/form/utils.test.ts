import { getState, doBlur } from './utils';

describe('getState', () => {
  expect(getState({ invalid: true, touched: true, validating: false })).toEqual(
    {
      color: 'danger',
      valid: false
    }
  );

  expect(
    getState({ invalid: false, touched: true, validating: false })
  ).toEqual({
    color: 'success',
    valid: true
  });
  expect(
    getState({ invalid: false, touched: false, validating: false })
  ).toEqual({
    color: 'success',
    valid: true
  });

  expect(
    getState({ invalid: true, touched: false, validating: false })
  ).toEqual({ color: '', valid: undefined });

  expect(
    getState({ invalid: false, touched: false, validating: true })
  ).toEqual({ color: '', valid: undefined });
});

test('doBlur', () => {
  expect(doBlur()).toBe(undefined);

  const onBlur = jest.fn();
  expect(doBlur(onBlur)).toBe(undefined);
  expect(onBlur).toBeCalledTimes(1);
});
