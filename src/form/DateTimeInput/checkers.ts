import moment, { MomentInput } from 'moment';
import { alwaysTrue } from '../utils';

/**
 * A date checker takes a MomentInput and decides if that date passes
 * or not by returning a boolean. When `true` is returned the date
 * passes, when `false` is returned the date failed the check.
 */
export type DateChecker = (date?: MomentInput) => boolean;

type IsDateBeforeConfig = {
  /**
   * Whether or not the end date should be inclusive or not.
   *
   * When `true` the date must be before or on the end date.
   * When `false` the date must be before the end date.
   *
   * Defaults to `false`
   */
  inclusive?: boolean;
};

/**
 * Creates a function which accept a date and returns whether or not
 * the date lies before the end date.
 *
 * Useful for the `DateTimeInput` components `isDateAllowed` prop.
 *
 * @param {MomentInput} end The end date to which the date must be before.
 * @param {IsDateBeforeConfig} config The configuration of the isDateBefore function.
 * @returns {DateValidator} A date validator function which checks if the date lies before the end date.
 */
export function isDateBefore(
  end: MomentInput,
  config: IsDateBeforeConfig = { inclusive: false }
): DateChecker {
  const { inclusive } = config;

  if (!end) {
    return alwaysTrue;
  }

  return (date?: MomentInput) => {
    if (!date) {
      return true;
    }

    if (inclusive) {
      return moment(date).isSameOrBefore(end);
    } else {
      return moment(date).isBefore(end);
    }
  };
}

type IsDateAfterConfig = {
  /**
   * Whether or not the start date should be inclusive or not.
   *
   * When `true` the date must be after or on the start date.
   * When `false` the date must be after the start date.
   *
   * Defaults to `false`
   */
  inclusive?: boolean;
};

/**
 * Creates a function which accept a date and returns whether or not
 * the date lies after the end date.
 *
 * Useful for the `DateTimeInput` components `isDateAllowed` prop.
 *
 * @param {MomentInput} start The start date to which the date must be after.
 * @param {IsDateAfterConfig} config The configuration of the isDateAfter function.
 * @returns {DateValidator} A date validator function which checks if the date lies after the start date.
 */
export function isDateAfter(
  start: MomentInput,
  config: IsDateAfterConfig = { inclusive: false }
): DateChecker {
  const { inclusive } = config;

  if (!start) {
    return alwaysTrue;
  }

  return (date?: MomentInput) => {
    if (!date) {
      return true;
    }

    if (inclusive) {
      return moment(date).isSameOrAfter(start);
    } else {
      return moment(date).isAfter(start);
    }
  };
}

export type IsDateBetweenConfig = {
  /**
   * Whether or not the date should be inclusive or not.
   *
   * When `true` the date must be after or on the start date.
   * When `false` the date must be after the start date.
   *
   * Defaults to `false`
   */
  startInclusive?: boolean;

  /**
   * Whether or not the date should be inclusive or not.
   *
   * When `true` the date must be before or on the end date.
   * When `false` the date must be before the end date.
   *
   * Defaults to `false`
   */
  endInclusive?: boolean;
};

/**
 * Creates a function which accepts a start and end date and returns
 * whether or not the date lies between the start and end date.
 *
 * Useful for the `DateTimeInput` components `isDateAllowed` prop.
 *
 * @param {MomentInput} start The start date to which the date must be before.
 * @param {MomentInput} end The end date to which the date must be after.
 * @param {IsDateBetweenConfig} config The configuration of the isDateBetween function.
 * @returns {DateValidator} A date validator function which checks if the date is between the start and end date
 */
export function isDateBetween(
  start: MomentInput,
  end: MomentInput,
  config: IsDateBetweenConfig = {
    startInclusive: false,
    endInclusive: false
  }
): DateChecker {
  // If there is no start and end allow the user to pick all dates
  if (!start && !end) {
    return alwaysTrue;
  }

  const { startInclusive, endInclusive } = config;

  if (!end) {
    // If there is no end but a start then the date must at least
    // lie after the start.
    return isDateAfter(start, { inclusive: startInclusive });
  }

  if (!start) {
    // If there is no start but an end then the date must at least
    // lie before the end.
    return isDateBefore(end, { inclusive: endInclusive });
  }

  return (date?: MomentInput) => {
    if (!date) {
      return true;
    }

    const startChar = startInclusive ? '[' : '(';
    const endChar = endInclusive ? ']' : ')';

    return moment(date).isBetween(
      start,
      end,
      undefined,
      `${startChar}${endChar}`
    );
  };
}
