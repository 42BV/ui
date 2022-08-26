import { LabelForOption } from '../option';
import { TypeaheadCustomOption, TypeaheadOption } from './types';

export function optionToTypeaheadOption<T>(
  option: T,
  labelForOption: LabelForOption<T>
): TypeaheadOption<T> {
  const label = labelForOption(option);

  return { label, value: option };
}

export function isTypeaheadCustomOption(option: any): option is TypeaheadCustomOption {
  return (option as TypeaheadCustomOption).customOption;
}
