import { combineFormat } from './utils';

test('combineFormat', () => {
  expect(combineFormat('YYYY-MM-DD', 'HH:mm:ss')).toBe('YYYY-MM-DD HH:mm:ss');
  expect(combineFormat('YYYY-MM-DD', false)).toBe('YYYY-MM-DD');
  expect(combineFormat(false, 'HH:mm:ss')).toBe('HH:mm:ss');

  expect(() => {
    combineFormat(false, false);
  }).toThrowError(
    'DateTimeInput: dateFormat and timeFormat cannot both be false'
  );
});
