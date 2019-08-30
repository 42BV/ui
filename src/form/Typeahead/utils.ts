import { TypeaheadOption } from './types';

export function valueToTypeaheadOption<T>(
  value: T,
  optionFor: (value: T) => string
): TypeaheadOption<T> {
  const label = optionFor(value);

  return { label, value };
}
