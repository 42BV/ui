import {
  isDateAfterValidator,
  isDateBeforeValidator,
  isDateBetweenValidator,
  isDateValidator
} from './validators';

describe('isDateBefore', () => {
  it('should when before is undefined allow every date', () => {
    const isBefore = isDateBeforeValidator({
      label: 'start',
      end: { path: 'end', label: 'end' }
    });

    const values = {
      end: undefined
    };

    expect(isBefore(new Date('2020-05-05'), values)).toBe(undefined);
    expect(isBefore(new Date('2020-05-06'), values)).toBe(undefined);
    expect(isBefore(new Date('2020-05-07'), values)).toBe(undefined);
    expect(isBefore(new Date('2020-05-08'), values)).toBe(undefined);
  });

  it('should support a custom error message', () => {
    const isBefore = isDateBeforeValidator({
      label: 'start',
      end: { path: 'end', label: 'end' },
      overrideErrorText: 'This is a custom error'
    });

    const values = {
      end: new Date('2020-05-08 12:00:00')
    };

    expect(isBefore(new Date('2020-05-08 12:00:01'), values)).toBe(
      'This is a custom error'
    );
  });

  describe('exclusive', () => {
    test('date', () => {
      const isBefore = isDateBeforeValidator({
        label: 'start',
        end: { path: 'end', label: 'end' }
      });

      const values = {
        end: new Date('2020-05-08')
      };

      expect(isBefore(new Date('2020-05-07'), values)).toBe(undefined);
      expect(isBefore(new Date('2020-05-08'), values)).toBe(
        `The "start" must be before the "end"`
      );
      expect(isBefore(new Date('2020-05-09'), values)).toBe(
        `The "start" must be before the "end"`
      );
      expect(isBefore(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isBefore = isDateBeforeValidator({
        label: 'start',
        end: { path: 'end', label: 'end' }
      });

      const values = {
        end: new Date('2020-05-08 12:00:00')
      };

      expect(isBefore(new Date('2020-05-08 11:59:59'), values)).toBe(undefined);
      expect(isBefore(new Date('2020-05-08 12:00:00'), values)).toBe(
        `The "start" must be before the "end"`
      );
      expect(isBefore(new Date('2020-05-08 12:00:01'), values)).toBe(
        `The "start" must be before the "end"`
      );
      expect(isBefore(undefined, values)).toBe(undefined);
    });
  });

  describe('inclusive', () => {
    test('date', () => {
      const isBefore = isDateBeforeValidator({
        label: 'start',
        end: { path: 'end', label: 'end', inclusive: true }
      });

      const values = {
        end: new Date('2020-05-08')
      };

      expect(isBefore(new Date('2020-05-07'), values)).toBe(undefined);
      expect(isBefore(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isBefore(new Date('2020-05-09'), values)).toBe(
        `The "start" must be before the "end"`
      );
      expect(isBefore(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isBefore = isDateBeforeValidator({
        label: 'start',
        end: { path: 'end', label: 'end', inclusive: true }
      });

      const values = {
        end: new Date('2020-05-08 12:00:00')
      };

      expect(isBefore(new Date('2020-05-08 11:59:59'), values)).toBe(undefined);
      expect(isBefore(new Date('2020-05-08 12:00:00'), values)).toBe(undefined);
      expect(isBefore(new Date('2020-05-08 12:00:01'), values)).toBe(
        `The "start" must be before the "end"`
      );

      expect(isBefore(undefined, values)).toBe(undefined);
    });
  });
});

describe('isDateAfter', () => {
  it('should when after is undefined allow every date', () => {
    const isAfter = isDateAfterValidator({
      label: 'end',
      start: { path: 'start', label: 'start' }
    });

    const values = {
      start: undefined
    };

    expect(isAfter(new Date('2020-05-05'), values)).toBe(undefined);
    expect(isAfter(new Date('2020-05-06'), values)).toBe(undefined);
    expect(isAfter(new Date('2020-05-07'), values)).toBe(undefined);
    expect(isAfter(new Date('2020-05-08'), values)).toBe(undefined);
  });

  it('should support a custom error message', () => {
    const isAfter = isDateAfterValidator({
      label: 'end',
      start: { path: 'start', label: 'start' },
      overrideErrorText: 'This is a custom error message'
    });

    const values = {
      start: new Date('2020-05-08')
    };

    expect(isAfter(new Date('2020-05-07'), values)).toBe(
      'This is a custom error message'
    );
  });

  describe('exclusive', () => {
    test('date', () => {
      const isAfter = isDateAfterValidator({
        label: 'end',
        start: { path: 'start', label: 'start' }
      });

      const values = {
        start: new Date('2020-05-08')
      };

      expect(isAfter(new Date('2020-05-07'), values)).toBe(
        `The "end" must be after the "start"`
      );
      expect(isAfter(new Date('2020-05-08'), values)).toBe(
        `The "end" must be after the "start"`
      );
      expect(isAfter(new Date('2020-05-09'), values)).toBe(undefined);

      expect(isAfter(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isAfter = isDateAfterValidator({
        label: 'end',
        start: { path: 'start', label: 'start' }
      });

      const values = {
        start: new Date('2020-05-08 12:00:00')
      };

      expect(isAfter(new Date('2020-05-08 11:59:59'), values)).toBe(
        `The "end" must be after the "start"`
      );
      expect(isAfter(new Date('2020-05-08 12:00:00'), values)).toBe(
        `The "end" must be after the "start"`
      );
      expect(isAfter(new Date('2020-05-08 12:00:01'), values)).toBe(undefined);

      expect(isAfter(undefined, values)).toBe(undefined);
    });
  });

  describe('inclusive', () => {
    test('date', () => {
      const isAfter = isDateAfterValidator({
        label: 'end',
        start: { path: 'start', label: 'start', inclusive: true }
      });

      const values = {
        start: new Date('2020-05-08')
      };

      expect(isAfter(new Date('2020-05-07'), values)).toBe(
        `The "end" must be after the "start"`
      );
      expect(isAfter(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isAfter(new Date('2020-05-09'), values)).toBe(undefined);

      expect(isAfter(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isAfter = isDateAfterValidator({
        label: 'end',
        start: { path: 'start', label: 'start', inclusive: true }
      });

      const values = {
        start: new Date('2020-05-08 12:00:00')
      };

      expect(isAfter(new Date('2020-05-08 11:59:59'), values)).toBe(
        `The "end" must be after the "start"`
      );
      expect(isAfter(new Date('2020-05-08 12:00:00'), values)).toBe(undefined);
      expect(isAfter(new Date('2020-05-08 12:00:01'), values)).toBe(undefined);

      expect(isAfter(undefined, values)).toBe(undefined);
    });
  });
});

describe('isDateBetween', () => {
  it('should when start, and end are both undefined allow every date', () => {
    const isBetween = isDateBetweenValidator({
      label: 'reminder',
      start: { path: 'start', label: 'start' },
      end: { path: 'end', label: 'end' }
    });

    const values = {
      start: undefined,
      end: new Date('2020-05-09')
    };

    expect(isBetween(new Date('2020-05-05'), values)).toBe(undefined);
    expect(isBetween(new Date('2020-05-06'), values)).toBe(undefined);
    expect(isBetween(new Date('2020-05-07'), values)).toBe(undefined);
    expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
  });

  describe('only start should fallback to after', () => {
    test('exclusive', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start' },
        end: { path: 'end', label: 'end' }
      });

      const values = {
        start: new Date('2020-05-07'),
        end: undefined
      };

      expect(isBetween(new Date('2020-05-06'), values)).toBe(
        `The "reminder" must be after the "start"`
      );
      expect(isBetween(new Date('2020-05-07'), values)).toBe(
        `The "reminder" must be after the "start"`
      );
      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
    });

    test('inclusive', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start', inclusive: true },
        end: { path: 'end', label: 'end' }
      });

      const values = {
        start: new Date('2020-05-07'),
        end: undefined
      };

      expect(isBetween(new Date('2020-05-06'), values)).toBe(
        `The "reminder" must be after the "start"`
      );
      expect(isBetween(new Date('2020-05-07'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
    });
  });

  describe('only end should fallback to before', () => {
    it('exclusive', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start' },
        end: { path: 'end', label: 'end' }
      });

      const values = {
        start: undefined,
        end: new Date('2020-05-09')
      };

      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-09'), values)).toBe(
        `The "reminder" must be before the "end"`
      );
      expect(isBetween(new Date('2020-05-10'), values)).toBe(
        `The "reminder" must be before the "end"`
      );
    });

    it('inclusive', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start' },
        end: { path: 'end', label: 'end', inclusive: true }
      });

      const values = {
        start: undefined,
        end: new Date('2020-05-09')
      };

      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-09'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-10'), values)).toBe(
        `The "reminder" must be before the "end"`
      );
    });
  });

  it('should support a custom error message', () => {
    const isBetween = isDateBetweenValidator({
      label: 'reminder',
      start: { path: 'start', label: 'start' },
      end: { path: 'end', label: 'end' },
      overrideErrorText: 'This is a custom error message'
    });

    const values = {
      start: new Date('2020-05-07'),
      end: new Date('2020-05-09')
    };

    expect(isBetween(new Date('2020-05-07'), values)).toBe(
      'This is a custom error message'
    );
  });

  describe('start and end exclusive', () => {
    test('date', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start' },
        end: { path: 'end', label: 'end' }
      });

      const values = {
        start: new Date('2020-05-07'),
        end: new Date('2020-05-09')
      };

      expect(isBetween(new Date('2020-05-07'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-09'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start' },
        end: { path: 'end', label: 'end' }
      });

      const values = {
        start: new Date('2020-05-08 12:00:00'),
        end: new Date('2020-05-08 12:00:02')
      };

      expect(isBetween(new Date('2020-05-08 12:00:00'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-08 12:00:01'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:02'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });
  });

  describe('start and end inclusive', () => {
    test('date', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start', inclusive: true },
        end: { path: 'end', label: 'end', inclusive: true }
      });

      const values = {
        start: new Date('2020-05-07'),
        end: new Date('2020-05-09')
      };

      expect(isBetween(new Date('2020-05-06'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-07'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-09'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-10'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start', inclusive: true },
        end: { path: 'end', label: 'end', inclusive: true }
      });

      const values = {
        start: new Date('2020-05-08 12:00:00'),
        end: new Date('2020-05-08 12:00:02')
      };

      expect(isBetween(new Date('2020-05-08 11:59:59'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-08 12:00:00'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:01'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:02'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:03'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });
  });

  describe('start inclusive end exclusive', () => {
    test('date', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start', inclusive: true },
        end: { path: 'end', label: 'end', inclusive: false }
      });

      const values = {
        start: new Date('2020-05-07'),
        end: new Date('2020-05-09')
      };

      expect(isBetween(new Date('2020-05-06'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-07'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-09'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start', inclusive: true },
        end: { path: 'end', label: 'end', inclusive: false }
      });

      const values = {
        start: new Date('2020-05-08 12:00:00'),
        end: new Date('2020-05-08 12:00:02')
      };

      expect(isBetween(new Date('2020-05-08 11:59:59'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-08 12:00:00'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:01'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:02'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });
  });

  describe('start exclusive end inclusive', () => {
    test('date', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start', inclusive: false },
        end: { path: 'end', label: 'end', inclusive: true }
      });

      const values = {
        start: new Date('2020-05-07'),
        end: new Date('2020-05-09')
      };

      expect(isBetween(new Date('2020-05-07'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-08'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-09'), values)).toBe(undefined);
      expect(isBetween(new Date('2020-05-10'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });

    test('date and time', () => {
      const isBetween = isDateBetweenValidator({
        label: 'reminder',
        start: { path: 'start', label: 'start', inclusive: false },
        end: { path: 'end', label: 'end', inclusive: true }
      });

      const values = {
        start: new Date('2020-05-08 12:00:00'),
        end: new Date('2020-05-08 12:00:02')
      };

      expect(isBetween(new Date('2020-05-08 12:00:00'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );
      expect(isBetween(new Date('2020-05-08 12:00:01'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:02'), values)).toBe(
        undefined
      );
      expect(isBetween(new Date('2020-05-08 12:00:03'), values)).toBe(
        `The "reminder" must be between the "start" and "end"`
      );

      expect(isBetween(undefined, values)).toBe(undefined);
    });
  });
});

describe('isDate', () => {
  it('should support a custom error message', () => {
    const isDate = isDateValidator({
      label: 'start',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      overrideErrorText: 'This is a custom error'
    });

    const values = {
      end: new Date('2020-05-08 12:00:00')
    };

    expect(isDate(new Date('2020-42-42 12:00:01'), values)).toBe(
      'This is a custom error'
    );
  });

  test('date', () => {
    const isDate = isDateValidator({
      label: 'start',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: false
    });

    expect(isDate(new Date('2020-05-07'), {})).toBe(undefined);
    expect(isDate('2020-05-08', {})).toBe(undefined);

    expect(isDate('2022-42-42', {})).toBe(
      'Must match required format "YYYY-MM-DD"'
    );
    expect(isDate('2022-__-__', {})).toBe(
      'Must match required format "YYYY-MM-DD"'
    );
    expect(isDate(undefined, {})).toBe(undefined);
  });

  test('time', () => {
    const isDate = isDateValidator({
      label: 'start',
      dateFormat: false,
      timeFormat: 'HH:mm:ss'
    });

    expect(isDate(new Date('2020-05-07'), {})).toBe(undefined);
    expect(isDate('12:00:00', {})).toBe(undefined);

    expect(isDate('12:__:__', {})).toBe(
      'Must match required format "HH:mm:ss"'
    );
    expect(isDate(undefined, {})).toBe(undefined);
  });

  test('date and time', () => {
    const isDate = isDateValidator({
      label: 'start',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss'
    });

    expect(isDate(new Date('2020-05-08 11:59:59'), {})).toBe(undefined);
    expect(isDate('2020-05-08 11:59:59', {})).toBe(undefined);

    expect(isDate('2020-05-08 __:__:__', {})).toBe(
      'Must match required format "YYYY-MM-DD HH:mm:ss"'
    );
    expect(isDate('2020-__-__ 12:00:01', {})).toBe(
      'Must match required format "YYYY-MM-DD HH:mm:ss"'
    );
    expect(isDate('2020-42-42 12:00:01', {})).toBe(
      'Must match required format "YYYY-MM-DD HH:mm:ss"'
    );
    expect(isDate(undefined, {})).toBe(undefined);
  });
});
