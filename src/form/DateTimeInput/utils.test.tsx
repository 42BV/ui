import { combineFormat, formatToMask } from './utils';

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

test('formatToMask', () => {
  expect(formatToMask('YYYY-MM-DD', 'HH:mm:ss')).toEqual([
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    ':',
    /\d/,
    /\d/,
    ':',
    /\d/,
    /\d/
  ]);
  expect(formatToMask('YYYY/MM/DD', false)).toEqual([
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/
  ]);
  expect(formatToMask('YYYY.MM.DD', false)).toEqual([
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/
  ]);
  expect(formatToMask('YYYY-MM-DD', false)).toEqual([
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/
  ]);
  expect(formatToMask(false, 'HH:mm:ss')).toEqual([
    /\d/,
    /\d/,
    ':',
    /\d/,
    /\d/,
    ':',
    /\d/,
    /\d/
  ]);

  expect(() => {
    formatToMask('hupbarbatruck', false);
  }).toThrowError('DateTimeInput: cannot extract separator from dateFormat');
});
