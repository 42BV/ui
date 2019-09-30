
import { nextDirection } from './utils';

test('Util: nextDirection', () => {
  expect(nextDirection('NONE')).toBe('ASC');
  expect(nextDirection('ASC')).toBe('DESC');
  expect(nextDirection('DESC')).toBe('ASC');
});