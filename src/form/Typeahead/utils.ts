import { LabelForOption } from '../option';
import { TypeaheadOption } from './types';

export function optionToTypeaheadOption<T>(
  option: T,
  labelForOption: LabelForOption<T>
): TypeaheadOption<T> {
  const label = labelForOption(option);

  return { label, value: option };
}
