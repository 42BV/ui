import { errorMessage, keyForError } from './utils';
import { setTranslator, Translator } from '../translator';

describe('keyForError', () => {
  test('Error is a string', () => {
    expect(keyForError('Serious error')).toBe('Serious error');
  });

  test('Error is a Translation', () => {
    expect(
      keyForError({ key: 'test', data: { age: 12 }, fallback: 'test' })
    ).toBe('test');
  });

  test('Error is ValidationError', () => {
    const error = {
      type: 'ERROR_REQUIRED',
      label: 'Name',
      value: '',
      reasons: {}
    };

    // @ts-ignore
    expect(keyForError(error)).toBe('ERROR_REQUIRED');
  });
});

describe('errorMessage', () => {
  let t: Translator;

  beforeEach(() => {
    t = jest.fn(translation => translation.fallback);

    setTranslator(t);
  });

  test('Error is a string', () => {
    errorMessage('Serious error');

    expect(t).toHaveBeenCalledTimes(1);
    expect(t).toHaveBeenCalledWith({
      fallback: 'Serious error',
      key: 'Serious error'
    });
  });

  test('Error is a Translation', () => {
    const error = { key: 'test', data: { age: 12 }, fallback: 'test' };

    errorMessage(error);

    expect(t).toHaveBeenCalledTimes(1);
    expect(t).toHaveBeenCalledWith(error);
  });

  describe('ValidationError from jarb-final-form', () => {
    test('ERROR_REQUIRED', () => {
      const error = {
        type: 'ERROR_REQUIRED',
        label: 'Name',
        value: '',
        reasons: {}
      };
      // @ts-ignore
      errorMessage(error);

      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith({
        data: { label: 'Name', reasons: {}, type: 'ERROR_REQUIRED', value: '' },
        fallback: 'Name is required',
        key: 'JarbFinalForm.VALIDATION.REQUIRED'
      });
    });

    test('ERROR_MINIMUM_LENGTH', () => {
      const error = {
        type: 'ERROR_MINIMUM_LENGTH',
        label: 'Age',
        value: '',
        reasons: {
          minimumLength: 10
        }
      };
      // @ts-ignore
      errorMessage(error);

      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith({
        data: {
          label: 'Age',
          reasons: { minimumLength: 10 },
          type: 'ERROR_MINIMUM_LENGTH',
          value: ''
        },
        fallback: 'Age must be bigger than 10 characters',
        key: 'JarbFinalForm.VALIDATION.MINIMUM_LENGTH'
      });
    });

    test('ERROR_MAXIMUM_LENGTH', () => {
      const error = {
        type: 'ERROR_MAXIMUM_LENGTH',
        label: 'Eyecolor',
        value: '',
        reasons: {
          maximumLength: 13
        }
      };
      // @ts-ignore
      errorMessage(error);

      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith({
        data: {
          label: 'Eyecolor',
          reasons: { maximumLength: 13 },
          type: 'ERROR_MAXIMUM_LENGTH',
          value: ''
        },
        fallback: 'Eyecolor must be smaller than 13 characters',
        key: 'JarbFinalForm.VALIDATION.MAXIMUM_LENGTH'
      });
    });

    test('ERROR_MIN_VALUE', () => {
      const error = {
        type: 'ERROR_MIN_VALUE',
        label: 'Legs',
        value: '',
        reasons: {
          minValue: 15
        }
      };
      // @ts-ignore
      errorMessage(error, t);

      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith({
        data: {
          label: 'Legs',
          reasons: { minValue: 15 },
          type: 'ERROR_MIN_VALUE',
          value: ''
        },
        fallback: 'Legs must be more than 15',
        key: 'JarbFinalForm.VALIDATION.MIN_VALUE'
      });
    });

    test('ERROR_MAX_VALUE', () => {
      const error = {
        type: 'ERROR_MAX_VALUE',
        label: 'Arms',
        value: '',
        reasons: {
          maxValue: 51
        }
      };
      // @ts-ignore
      errorMessage(error, t);

      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith({
        data: {
          label: 'Arms',
          reasons: { maxValue: 51 },
          type: 'ERROR_MAX_VALUE',
          value: ''
        },
        fallback: 'Arms must be less than 51',
        key: 'JarbFinalForm.VALIDATION.MAX_VALUE'
      });
    });

    test('ERROR_NUMBER', () => {
      const error = {
        type: 'ERROR_NUMBER',
        label: 'Head',
        value: '',
        reasons: {
          regex: 'regex'
        }
      };
      // @ts-ignore
      errorMessage(error);

      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith({
        data: {
          label: 'Head',
          reasons: { regex: 'regex' },
          type: 'ERROR_NUMBER',
          value: ''
        },
        fallback: 'Head is not a number',
        key: 'JarbFinalForm.VALIDATION.NUMBER'
      });
    });

    test('ERROR_NUMBER_FRACTION', () => {
      const error = {
        type: 'ERROR_NUMBER_FRACTION',
        label: 'Head',
        value: '',
        reasons: {
          regex: 'regex',
          fraction: 2
        }
      };
      // @ts-ignore
      errorMessage(error);

      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith({
        data: {
          label: 'Head',
          reasons: { fraction: 2, regex: 'regex' },
          type: 'ERROR_NUMBER_FRACTION',
          value: ''
        },
        fallback:
          'Head is not a number. Number may have undefined digits behind the comma',
        key: 'JarbFinalForm.VALIDATION.NUMBER_FRACTION'
      });
    });
  });

  test('fallback scenario', () => {
    const error = {
      type: 'UNKNOWN_ERROR'
    };
    // @ts-ignore
    errorMessage(error);

    expect(t).toHaveBeenCalledTimes(1);
    expect(t).toHaveBeenCalledWith({
      fallback: 'Something is wrong',
      key: 'FormError.UNKNOWN_ERROR'
    });
  });
});
