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
