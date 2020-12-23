import { useEffect } from 'react';
import { TypeaheadOption } from '../types';

type Config<T> = {
  typeaheadOptions: TypeaheadOption<T>[];
  query: string;
  onChange: (value: T) => void;
};

export function useAutoSelectOptionWhenQueryMatchesExactly<T>({
  typeaheadOptions,
  onChange,
  query
}: Config<T>): void {
  // When value matches the query exactly select it.
  useEffect(() => {
    const lowerCasedQuery = query.toLowerCase();

    const selectedValue = typeaheadOptions.find(
      ({ label }) => label.toLowerCase() === lowerCasedQuery
    );

    if (selectedValue) {
      onChange(selectedValue.value);
    }
  }, [typeaheadOptions, onChange, query]);
}
