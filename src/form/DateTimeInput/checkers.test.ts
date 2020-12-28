import moment from 'moment';
import { isDateBefore, isDateAfter, isDateBetween } from './checkers';

describe('isDateBefore', () => {
  it('should when before is undefined allow every date', () => {
    const isBefore = isDateBefore(undefined);

    expect(isBefore('2020-05-05')).toBe(true);
    expect(isBefore('2020-05-06')).toBe(true);
    expect(isBefore('2020-05-07')).toBe(true);
    expect(isBefore('2020-05-08')).toBe(true);
  });

  describe('exclusive', () => {
    test('date', () => {
      const isBefore = isDateBefore('2020-05-08');

      expect(isBefore(moment('2020-05-07'))).toBe(true);
      expect(isBefore('2020-05-07')).toBe(true);
      expect(isBefore(new Date(2020, 4, 7))).toBe(true);

      expect(isBefore(moment('2020-05-08'))).toBe(false);
      expect(isBefore('2020-05-08')).toBe(false);
      expect(isBefore(new Date(2020, 4, 8))).toBe(false);

      expect(isBefore(moment('2020-05-09'))).toBe(false);
      expect(isBefore('2020-05-09')).toBe(false);
      expect(isBefore(new Date(2020, 4, 9))).toBe(false);

      expect(isBefore(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isBefore = isDateBefore('2020-05-08 12:00:00');

      expect(isBefore(moment('2020-05-08 11:59:59'))).toBe(true);
      expect(isBefore('2020-05-08 11:59:59')).toBe(true);
      expect(isBefore(new Date(2020, 4, 8, 11, 59, 59))).toBe(true);

      expect(isBefore(moment('2020-05-08 12:00:00'))).toBe(false);
      expect(isBefore('2020-05-08 12:00:00')).toBe(false);
      expect(isBefore(new Date(2020, 4, 8, 12, 0, 0))).toBe(false);

      expect(isBefore(moment('2020-05-08 12:00:01'))).toBe(false);
      expect(isBefore('2020-05-08 12:00:01')).toBe(false);
      expect(isBefore(new Date(2020, 4, 8, 12, 0, 1))).toBe(false);

      expect(isBefore(undefined)).toBe(true);
    });
  });

  describe('inclusive', () => {
    test('date', () => {
      const isBefore = isDateBefore('2020-05-08', { inclusive: true });

      expect(isBefore(moment('2020-05-07'))).toBe(true);
      expect(isBefore('2020-05-07')).toBe(true);
      expect(isBefore(new Date(2020, 4, 7))).toBe(true);

      expect(isBefore(moment('2020-05-08'))).toBe(true);
      expect(isBefore('2020-05-08')).toBe(true);
      expect(isBefore(new Date(2020, 4, 8))).toBe(true);

      expect(isBefore(moment('2020-05-09'))).toBe(false);
      expect(isBefore('2020-05-09')).toBe(false);
      expect(isBefore(new Date(2020, 4, 9))).toBe(false);

      expect(isBefore(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isBefore = isDateBefore('2020-05-08 12:00:00', { inclusive: true });

      expect(isBefore(moment('2020-05-08 11:59:59'))).toBe(true);
      expect(isBefore('2020-05-08 11:59:59')).toBe(true);
      expect(isBefore(new Date(2020, 4, 8, 11, 59, 59))).toBe(true);

      expect(isBefore(moment('2020-05-08 12:00:00'))).toBe(true);
      expect(isBefore('2020-05-08 12:00:00')).toBe(true);
      expect(isBefore(new Date(2020, 4, 8, 12, 0, 0))).toBe(true);

      expect(isBefore(moment('2020-05-08 12:00:01'))).toBe(false);
      expect(isBefore('2020-05-08 12:00:01')).toBe(false);
      expect(isBefore(new Date(2020, 4, 8, 12, 0, 1))).toBe(false);

      expect(isBefore(undefined)).toBe(true);
    });
  });
});

describe('isDateAfter', () => {
  it('should when after is undefined allow every date', () => {
    const isAfter = isDateAfter(undefined);

    expect(isAfter('2020-05-05')).toBe(true);
    expect(isAfter('2020-05-06')).toBe(true);
    expect(isAfter('2020-05-07')).toBe(true);
    expect(isAfter('2020-05-08')).toBe(true);
  });

  describe('exclusive', () => {
    test('date', () => {
      const isAfter = isDateAfter('2020-05-08');

      expect(isAfter(moment('2020-05-07'))).toBe(false);
      expect(isAfter('2020-05-07')).toBe(false);
      expect(isAfter(new Date(2020, 4, 7))).toBe(false);

      expect(isAfter(moment('2020-05-08'))).toBe(false);
      expect(isAfter('2020-05-08')).toBe(false);
      expect(isAfter(new Date(2020, 4, 8))).toBe(false);

      expect(isAfter(moment('2020-05-09'))).toBe(true);
      expect(isAfter('2020-05-09')).toBe(true);
      expect(isAfter(new Date(2020, 4, 9))).toBe(true);

      expect(isAfter(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isAfter = isDateAfter('2020-05-08 12:00:00');

      expect(isAfter(moment('2020-05-08 11:59:59'))).toBe(false);
      expect(isAfter('2020-05-08 11:59:59')).toBe(false);
      expect(isAfter(new Date(2020, 4, 8, 11, 59, 59))).toBe(false);

      expect(isAfter(moment('2020-05-08 12:00:00'))).toBe(false);
      expect(isAfter('2020-05-08 12:00:00')).toBe(false);
      expect(isAfter(new Date(2020, 4, 8, 12, 0, 0))).toBe(false);

      expect(isAfter(moment('2020-05-08 12:00:01'))).toBe(true);
      expect(isAfter('2020-05-08 12:00:01')).toBe(true);
      expect(isAfter(new Date(2020, 4, 8, 12, 0, 1))).toBe(true);

      expect(isAfter(undefined)).toBe(true);
    });
  });

  describe('inclusive', () => {
    test('date', () => {
      const isAfter = isDateAfter('2020-05-08', { inclusive: true });

      expect(isAfter(moment('2020-05-07'))).toBe(false);
      expect(isAfter('2020-05-07')).toBe(false);
      expect(isAfter(new Date(2020, 4, 7))).toBe(false);

      expect(isAfter(moment('2020-05-08'))).toBe(true);
      expect(isAfter('2020-05-08')).toBe(true);
      expect(isAfter(new Date(2020, 4, 8))).toBe(true);

      expect(isAfter(moment('2020-05-09'))).toBe(true);
      expect(isAfter('2020-05-09')).toBe(true);
      expect(isAfter(new Date(2020, 4, 9))).toBe(true);

      expect(isAfter(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isAfter = isDateAfter('2020-05-08 12:00:00', { inclusive: true });

      expect(isAfter(moment('2020-05-08 11:59:59'))).toBe(false);
      expect(isAfter('2020-05-08 11:59:59')).toBe(false);
      expect(isAfter(new Date(2020, 4, 8, 11, 59, 59))).toBe(false);

      expect(isAfter(moment('2020-05-08 12:00:00'))).toBe(true);
      expect(isAfter('2020-05-08 12:00:00')).toBe(true);
      expect(isAfter(new Date(2020, 4, 8, 12, 0, 0))).toBe(true);

      expect(isAfter(moment('2020-05-08 12:00:01'))).toBe(true);
      expect(isAfter('2020-05-08 12:00:01')).toBe(true);
      expect(isAfter(new Date(2020, 4, 8, 12, 0, 1))).toBe(true);

      expect(isAfter(undefined)).toBe(true);
    });
  });
});

describe('isDateBetween', () => {
  it('should when start is undefined allow every date', () => {
    const isBetween = isDateBetween(undefined, '2020-05-09');

    expect(isBetween('2020-05-05')).toBe(true);
    expect(isBetween('2020-05-06')).toBe(true);
    expect(isBetween('2020-05-07')).toBe(true);
    expect(isBetween('2020-05-08')).toBe(true);
  });

  it('should when end is undefined allow every date', () => {
    const isBetween = isDateBetween('2020-05-07', undefined);

    expect(isBetween('2020-05-05')).toBe(true);
    expect(isBetween('2020-05-06')).toBe(true);
    expect(isBetween('2020-05-07')).toBe(true);
    expect(isBetween('2020-05-08')).toBe(true);
  });

  describe('start and end exclusive', () => {
    test('date', () => {
      const isBetween = isDateBetween('2020-05-07', '2020-05-09');

      expect(isBetween(moment('2020-05-07'))).toBe(false);
      expect(isBetween('2020-05-07')).toBe(false);
      expect(isBetween(new Date(2020, 4, 7))).toBe(false);

      expect(isBetween(moment('2020-05-08'))).toBe(true);
      expect(isBetween('2020-05-08')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8))).toBe(true);

      expect(isBetween(moment('2020-05-09'))).toBe(false);
      expect(isBetween('2020-05-09')).toBe(false);
      expect(isBetween(new Date(2020, 4, 9))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isBetween = isDateBetween(
        '2020-05-08 12:00:00',
        '2020-05-08 12:00:02'
      );

      expect(isBetween(moment('2020-05-08 12:00:00'))).toBe(false);
      expect(isBetween('2020-05-08 12:00:00')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 0))).toBe(false);

      expect(isBetween(moment('2020-05-08 12:00:01'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:01')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 1))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:02'))).toBe(false);
      expect(isBetween('2020-05-08 12:00:02')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 2))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });
  });

  describe('start and end inclusive', () => {
    test('date', () => {
      const isBetween = isDateBetween('2020-05-07', '2020-05-09', {
        startInclusive: true,
        endInclusive: true
      });
      expect(isBetween(moment('2020-05-06'))).toBe(false);
      expect(isBetween('2020-05-06')).toBe(false);
      expect(isBetween(new Date(2020, 4, 6))).toBe(false);

      expect(isBetween(moment('2020-05-07'))).toBe(true);
      expect(isBetween('2020-05-07')).toBe(true);
      expect(isBetween(new Date(2020, 4, 7))).toBe(true);

      expect(isBetween(moment('2020-05-08'))).toBe(true);
      expect(isBetween('2020-05-08')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8))).toBe(true);

      expect(isBetween(moment('2020-05-09'))).toBe(true);
      expect(isBetween('2020-05-09')).toBe(true);
      expect(isBetween(new Date(2020, 4, 9))).toBe(true);

      expect(isBetween(moment('2020-05-10'))).toBe(false);
      expect(isBetween('2020-05-10')).toBe(false);
      expect(isBetween(new Date(2020, 4, 10))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isBetween = isDateBetween(
        '2020-05-08 12:00:00',
        '2020-05-08 12:00:02',
        { startInclusive: true, endInclusive: true }
      );

      expect(isBetween(moment('2020-05-08 11:59:59'))).toBe(false);
      expect(isBetween('2020-05-08 11:59:59')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 11, 59, 59))).toBe(false);

      expect(isBetween(moment('2020-05-08 12:00:00'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:00')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 0))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:01'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:01')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 1))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:02'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:02')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 2))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:03'))).toBe(false);
      expect(isBetween('2020-05-08 12:00:03')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 3))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });
  });

  describe('start inclusive end exclusive', () => {
    test('date', () => {
      const isBetween = isDateBetween('2020-05-07', '2020-05-09', {
        startInclusive: true,
        endInclusive: false
      });
      expect(isBetween(moment('2020-05-06'))).toBe(false);
      expect(isBetween('2020-05-06')).toBe(false);
      expect(isBetween(new Date(2020, 4, 6))).toBe(false);

      expect(isBetween(moment('2020-05-07'))).toBe(true);
      expect(isBetween('2020-05-07')).toBe(true);
      expect(isBetween(new Date(2020, 4, 7))).toBe(true);

      expect(isBetween(moment('2020-05-08'))).toBe(true);
      expect(isBetween('2020-05-08')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8))).toBe(true);

      expect(isBetween(moment('2020-05-09'))).toBe(false);
      expect(isBetween('2020-05-09')).toBe(false);
      expect(isBetween(new Date(2020, 4, 9))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isBetween = isDateBetween(
        '2020-05-08 12:00:00',
        '2020-05-08 12:00:02',
        { startInclusive: true, endInclusive: false }
      );

      expect(isBetween(moment('2020-05-08 11:59:59'))).toBe(false);
      expect(isBetween('2020-05-08 11:59:59')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 11, 59, 59))).toBe(false);

      expect(isBetween(moment('2020-05-08 12:00:00'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:00')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 0))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:01'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:01')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 1))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:02'))).toBe(false);
      expect(isBetween('2020-05-08 12:00:02')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 2))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });
  });

  describe('start exclusive end inclusive', () => {
    test('date', () => {
      const isBetween = isDateBetween('2020-05-07', '2020-05-09', {
        startInclusive: false,
        endInclusive: true
      });
      expect(isBetween(moment('2020-05-07'))).toBe(false);
      expect(isBetween('2020-05-07')).toBe(false);
      expect(isBetween(new Date(2020, 4, 7))).toBe(false);

      expect(isBetween(moment('2020-05-08'))).toBe(true);
      expect(isBetween('2020-05-08')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8))).toBe(true);

      expect(isBetween(moment('2020-05-09'))).toBe(true);
      expect(isBetween('2020-05-09')).toBe(true);
      expect(isBetween(new Date(2020, 4, 9))).toBe(true);

      expect(isBetween(moment('2020-05-10'))).toBe(false);
      expect(isBetween('2020-05-10')).toBe(false);
      expect(isBetween(new Date(2020, 4, 10))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });

    test('date and time', () => {
      const isBetween = isDateBetween(
        '2020-05-08 12:00:00',
        '2020-05-08 12:00:02',
        { startInclusive: false, endInclusive: true }
      );

      expect(isBetween(moment('2020-05-08 12:00:00'))).toBe(false);
      expect(isBetween('2020-05-08 12:00:00')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 0))).toBe(false);

      expect(isBetween(moment('2020-05-08 12:00:01'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:01')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 1))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:02'))).toBe(true);
      expect(isBetween('2020-05-08 12:00:02')).toBe(true);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 2))).toBe(true);

      expect(isBetween(moment('2020-05-08 12:00:03'))).toBe(false);
      expect(isBetween('2020-05-08 12:00:03')).toBe(false);
      expect(isBetween(new Date(2020, 4, 8, 12, 0, 3))).toBe(false);

      expect(isBetween(undefined)).toBe(true);
    });
  });
});
