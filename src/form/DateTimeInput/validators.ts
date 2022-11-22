import { FieldValidator } from 'final-form';
import { get } from 'lodash';
import { MomentInput } from 'moment';
import { t } from '../../utilities/translation/translation';
import {
  isDate,
  isDateAfter,
  isDateBefore,
  isDateBetween,
  IsDateBetweenConfig
} from './checkers';
import { DateFormat, TimeFormat } from './types';
import { combineFormat } from './utils';

type IsDateValidatorConfig = {
  /**
   * The date format the date should match.
   */
  dateFormat: DateFormat;

  /**
   * The time format the date should match.
   */
  timeFormat: TimeFormat;

  /**
   * The label of the date that is being validated.
   * Used in error messages.
   */
  label?: string;

  /**
   * A custom error text which overrides the error message when
   * provided.
   *
   * When `overrideErrorText` is used the label is not used,
   * you can make label an empty string.
   */
  overrideErrorText?: string;
};

/**
 * Creates a final form date validator function which validates if
 * the date is an actual date that matches the provided format.
 *
 * Useful for the `JarbDateTimeInput` components `validators` prop.
 *
 * @param {IsDateValidatorConfig} config The configuration for the isDateBeforeValidator
 * @returns {FieldValidator<MomentInput>} A date validator function which checks if the date lies before the end date.
 */
export function isDateValidator(
  config: IsDateValidatorConfig
): FieldValidator<MomentInput> {
  const { dateFormat, timeFormat, label } = config;

  return (value?: MomentInput): string | undefined => {
    if (!value || isDate({ dateFormat, timeFormat })(value)) {
      return undefined;
    }

    return t({
      key: 'DateTimeInput.INVALID_DATE',
      fallback: `Must match required format "${combineFormat(
        dateFormat,
        timeFormat
      )}"`,
      data: {
        format: combineFormat(dateFormat, timeFormat),
        label
      },
      overrideText: config.overrideErrorText
    });
  };
}

type Start = {
  /**
   * The path to the start date given the form's values object.
   * Which is the date for which you want the date to always be
   * after.
   *
   * Given the following values object:
   *
   * ```JSON
   * {
   *   "appointment": {
   *    "start": "2020-12-01T00:00:00.000Z",
   *    "end": "2020-12-02T00:00:00.000Z"
   *    }
   * }
   * ```
   *
   * The path to the start date would be "appointment.start".
   */
  path: string;

  /**
   * The path to the end date given the form's values object.
   * Which is the date for which you want the date to always be
   * before.
   */
  label: string;

  /**
   * Whether the start date should be inclusive or not.
   *
   * When `true` the date must be after or on the start date.
   * When `false` the date must be after the start date.
   *
   * Defaults to `false`
   */
  inclusive?: boolean;
};

type End = {
  /**
   * The path to the end date given the form's values object.
   * Which is the date for which you want the date to always be
   * before.
   *
   * Given the following values object:
   *
   * ```JSON
   * {
   *   "appointment": {
   *    "start": "2020-12-01T00:00:00.000Z",
   *    "end": "2020-12-02T00:00:00.000Z"
   *    }
   * }
   * ```
   *
   * The path to the end date would be "appointment.end".
   *
   * @see https://lodash.com/docs/4.17.15#get
   */
  path: string;

  /**
   * The label of the end date. Used in error messages.
   */
  label: string;

  /**
   * Whether the end date should be inclusive or not.
   *
   * When `true` the date must be before or on the end date.
   * When `false` the date must be before the end date.
   *
   * Defaults to `false`
   */
  inclusive?: boolean;
};

type IsDateBeforeValidatorConfig = {
  end: End;

  /**
   * The label of the date which must be before the end date.
   * Used in error messages.
   */
  label: string;

  /**
   * A custom error text which overrides the error message when
   * provided.
   *
   * When `overrideErrorText` is used the `end.label` is not used, and
   * you can make `end.label` an empty string.
   */
  overrideErrorText?: string;
};

/**
 * Creates a final form date validator function which validates if
 * the date lies before the end date.
 *
 * Useful for the `JarbDateTimeInput` components `validators` prop.
 *
 * @param {IsDateAfterValidatorConfig} config The configuration for the isDateBeforeValidator
 * @returns {FieldValidator<MomentInput>} A date validator function which checks if the date lies before the end date.
 */
export function isDateBeforeValidator(
  config: IsDateBeforeValidatorConfig
): FieldValidator<MomentInput> {
  const { end, label, overrideErrorText } = config;

  return (
    value?: MomentInput,
    allValues?: Record<string, MomentInput>
  ): string | undefined => {
    if (!value) {
      return undefined;
    }

    const before = get(allValues, end.path);

    const result = isDateBefore(before, { inclusive: end.inclusive })(value);

    if (result) {
      return undefined;
    } else {
      return dateBeforeError({ label, end, overrideErrorText });
    }
  };
}

type IsDateAfterValidatorConfig = {
  start: Start;

  /**
   * The label of the date which must be after the start date.
   *
   * Used in error messages.
   */
  label: string;

  /**
   * A custom error text which overrides the error message when
   * provided.
   *
   * When `overrideErrorText` is used, the `start.label` is not used, and
   * you can make `start.label` an empty string.
   */
  overrideErrorText?: string;
};

/**
 * Creates a final form date validator function which validates if
 * the date lies after the start date.
 *
 * Useful for the `JarbDateTimeInput` components `validators` prop.
 *
 * @param {IsDateAfterValidatorConfig} config The configuration for the isDateBeforeValidator
 * @returns {FieldValidator<MomentInput>} A date validator function which checks if the date lies after the start date.
 */
export function isDateAfterValidator(
  config: IsDateAfterValidatorConfig
): FieldValidator<MomentInput> {
  const { start, label, overrideErrorText } = config;

  return (
    value?: MomentInput,
    allValues?: Record<string, any>
  ): string | undefined => {
    if (!value) {
      return undefined;
    }

    const after = get(allValues, start.path);

    const result = isDateAfter(after, { inclusive: start.inclusive })(value);

    if (result) {
      return undefined;
    } else {
      return dateAfterError({ label, start, overrideErrorText });
    }
  };
}

type IsDateBetweenValidatorConfig = IsDateBetweenConfig & {
  start: Start;

  end: End;

  /**
   * The label of the date which must be after the start date, and
   * before the end date.
   *
   * Used in error messages.
   */
  label: string;

  /**
   * A custom error text which overrides the error message when
   * provided.
   *
   * When `overrideErrorText` is used, the `start.label` and `end.label` are
   * not used, and you can make them empty strings.
   */
  overrideErrorText?: string;
};

/**
 * Creates a final form date validator function which validates if
 * the date lies after the start date, and before the end date.
 *
 * Useful for the `JarbDateTimeInput` components `validators` prop.
 *
 * @param {IsDateBetweenValidatorConfig} config The configuration for the isDateBetweenValidatorConfig
 * @returns {FieldValidator<MomentInput>} A date validator function which checks if the date lies after the start date, and before the end date.
 */
export function isDateBetweenValidator(
  config: IsDateBetweenValidatorConfig
): FieldValidator<MomentInput> {
  const { start, end, label, overrideErrorText } = config;

  return (
    value?: MomentInput,
    allValues?: Record<string, MomentInput>
  ): string | undefined => {
    if (!value) {
      return undefined;
    }

    const after = get(allValues, start.path);
    const before = get(allValues, end.path);

    const result = isDateBetween(after, before, {
      startInclusive: start.inclusive,
      endInclusive: end.inclusive
    })(value);

    if (result) {
      return undefined;
    } else {
      if (!before) {
        return dateAfterError({ label, start, overrideErrorText });
      }

      if (!after) {
        return dateBeforeError({ label, end, overrideErrorText });
      }

      return t({
        key: 'DateTimeInput.DATE_BETWEEN_ERROR',
        fallback: `The "${label}" must be between the "${start.label}" and "${end.label}"`,
        data: { start: start.label, label, end: end.label },
        overrideText: overrideErrorText
      });
    }
  };
}

function dateAfterError({
  label,
  start,
  overrideErrorText
}: {
  label;
  start: Start;
  overrideErrorText?: string;
}): string {
  return t({
    key: 'DateTimeInput.DATE_AFTER_ERROR',
    fallback: `The "${label}" must be after the "${start.label}"`,
    data: { start: start.label, end: label },
    overrideText: overrideErrorText
  });
}

function dateBeforeError({
  label,
  end,
  overrideErrorText
}: {
  label;
  end: End;
  overrideErrorText?: string;
}): string {
  return t({
    key: 'DateTimeInput.DATE_BEFORE_ERROR',
    fallback: `The "${label}" must be before the "${end.label}"`,
    data: { start: label, end: end.label },
    overrideText: overrideErrorText
  });
}
