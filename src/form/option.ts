import { Page } from '@42.nl/spring-connect';

/**
 * Callback to determine the label for a given value of type T.
 * Aka the text the user sees when selecting a value.
 */
export type OptionForValue<T> = (value: T) => string;

export type OptionEqual<T> = (a: T, b: T) => boolean;

/**
 * Callback to determine if the option is currently enabled.
 */
export type OptionEnabledCallback<T> = (option: T) => boolean;

/**
 * Callback which should return a Page of options which can
 * be selected by the user.
 */
export type OptionsFetcher<T> = () => Promise<Page<T>>;

/**
 * Callback which should return a Page of options which can
 * be selected by the user.
 *
 * It is given three parameters:
 *
 * 1. `query` A string you must use to filter the number of options.
 * Used for searches.
 *
 * 2. `page` A number telling you which page you must load. Used
 * to limit the total number of elements by asking for a small slice
 * each time.
 *
 * 3. `size` A number telling you the size of the Page you must load.
 * Often components can only render so much options before becoming
 * unwieldy. They can tell you the size of options they an support
 * through this parameter.
 */
export type FetchOptionsCallback<T> = (
  query: string,
  page: number,
  size: number
) => Promise<Page<T>>;

type IsOptionSelectedConfig<T> = {
  option: T;
  optionForValue: OptionForValue<T>;
  isOptionEqual?: OptionEqual<T>;
  value?: T[] | T;
};

export function isOptionSelected<T>({
  option,
  optionForValue,
  isOptionEqual,
  value
}: IsOptionSelectedConfig<T>): boolean {
  if (!value) {
    return false;
  }

  if (Array.isArray(value)) {
    if (isOptionEqual) {
      return value.some(v => isOptionEqual(v, option));
    } else {
      const label = optionForValue(option);
      return value.some(v => label === optionForValue(v));
    }
  } else {
    if (isOptionEqual) {
      return isOptionEqual(value, option);
    } else {
      const label = optionForValue(option);
      return label === optionForValue(value);
    }
  }
}
