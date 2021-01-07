import moment from 'moment';
import { InputMask } from '../Input/Input';
import { DateFormat, TimeFormat } from './types';

export function combineFormat(
  dateFormat: DateFormat,
  timeFormat: TimeFormat
): string {
  if (dateFormat !== false && timeFormat !== false) {
    return `${dateFormat} ${timeFormat}`;
  } else if (dateFormat !== false) {
    return dateFormat;
  } else if (timeFormat !== false) {
    return timeFormat;
  }

  throw new Error(
    'DateTimeInput: dateFormat and timeFormat cannot both be false'
  );
}

export function formatToMask(
  dateFormat: DateFormat,
  timeFormat: TimeFormat
): InputMask {
  const dateMask = dateFormatToMask(dateFormat);

  const timeMask = timeFormatToMask(timeFormat);

  const dateMaskIsDefined = dateMask.length > 0;

  if (dateMaskIsDefined && timeMask.length > 0) {
    return [...dateMask, ' ', ...timeMask];
  } else if (dateMaskIsDefined) {
    return dateMask;
  } else {
    return timeMask;
  }
}

function timeFormatToMask(timeFormat: TimeFormat): InputMask {
  if (timeFormat === false) {
    return [];
  }

  return timeFormat.split('').map((char) => (char === ':' ? ':' : /\d/));
}

function dateFormatToMask(dateFormat: DateFormat): InputMask {
  if (dateFormat === false) {
    return [];
  }

  const separator = extractSeparator(dateFormat);
  return dateFormat
    .split('')
    .map((char) => (char === separator ? separator : /\d/));
}

function extractSeparator(dateFormat: string): string {
  if (dateFormat.includes('-')) {
    return '-';
  }

  if (dateFormat.includes('/')) {
    return '/';
  }

  if (dateFormat.includes('.')) {
    return '.';
  }

  throw new Error('DateTimeInput: cannot extract separator from dateFormat');
}

export function isDate(
  value: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat
): boolean {
  // _ indicates a masks
  if (value.includes('_')) {
    return false;
  } else {
    const date = moment(
      value.trim(), // value includes an empty char at the back for some reason.
      combineFormat(dateFormat, timeFormat)
    );

    return date.isValid();
  }
}
