/**
 * Represents the value of a Typeahead.
 */
export type TypeaheadOption<T> = {
  label: string;
  value: T;
};

export type TypeaheadCustomOption = {
  label: string;
  customOption: true;
};
