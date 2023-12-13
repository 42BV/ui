import { Page } from '@42.nl/spring-connect';

export type Options<T> = FetchOptionsCallback<T> | T[];

/**
 * Variant of field compatible where the options the user can choose
 * are predetermined.
 */
export type FieldCompatibleWithPredeterminedOptions<T> = {
  /**
   * Is either a callback to fetch the options to display to the user.
   * When options is a callback it will not execute when the callback
   * changes, only when the `reloadOptions` changes will the callback
   * be executed again. This means that it is safe to pass in a
   * lambda / anonymous / unstable function here.
   *
   * Or an array of fixed options.
   */
  options: Options<T>;

  /**
   * Callback to convert a value of type T to an option to show
   * to the user.
   */
  labelForOption: LabelForOption<T>;

  /**
   * Optional callback which is used to determine if two options
   * of type T are equal.
   *
   * When `isOptionEqual` is not defined the outcome of `labelForOption`
   * is used to test equality.
   */
  isOptionEqual?: IsOptionEqual<T>;

  /**
   * Optional callback to get a unique key for an option.
   * This is used to provide each option in the form element a unique key.
   * Defaults to the 'id' property if it exists, otherwise uses labelForOption.
   */
  keyForOption?: KeyForOption<T>;

  /**
   * Optional callback which is called for every option to determine
   * if the option can be selected. By default, all options can be
   * selected.
   */
  isOptionEnabled?: IsOptionEnabled<T>;

  /**
   * Optionally a value to detect changes and trigger the
   * `options` to reload the options, by fetching them again.
   *
   * Whenever the value of `reloadOptions` changes the options are
   * reloaded. This gives the developer an external way to trigger
   * the reloading of the options.
   */
  reloadOptions?: string | number | boolean | null | undefined;
};

/**
 * Callback to determine the label for a given value of type T.
 * Aka the text the user sees when selecting a value.
 */
export type LabelForOption<T> = (option: T) => string;

/**
 * Callback to determine the unique identifier for a given value of type T.
 */
export type KeyForOption<T> = (value: T) => React.Key;

/**
 * Callback to determine if two options are equal to each other
 */
export type IsOptionEqual<T> = (a: T, b: T) => boolean;

/**
 * Callback to determine if the option is currently enabled.
 */
export type IsOptionEnabled<T> = (option: T) => boolean;

export type FetchOptionsCallbackConfig = {
  /**
   * The query which was provided by the component. If no query is
   * present an empty string is provided.
   */
  query: string;

  /**
   * The page number the developer must fetch from the back-end.
   * Starts at 1.
   */
  page: number;

  /**
   * The desired size which the form component accepts. The developer
   * should not provide more items than the size, otherwise unintended
   * things may happen.
   */
  size: number;
};

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
 * unwieldy. They can tell you the size of options they support
 * through this parameter.
 */
export type FetchOptionsCallback<T> = (
  config: FetchOptionsCallbackConfig
) => Promise<Page<T>>;

type KeyForOptionConfig<T> = {
  option: T;
  keyForOption?: KeyForOption<T>;
  labelForOption: LabelForOption<T>;
};

/**
 * Returns a unique key for an option.
 *
 * Will try the following ways to get a unique key in this order:
 *
 * 1. Will use: `keyForOption` if provided. In this case we
 *    must trust the developer to implement it correctly.
 *
 * 2. If the options has an `id` we expect that id to be unique and
 *    that `id` is used as the key.
 *
 * 3. As a last resort we will use the `labelForOption` in this case
 *    the label of the option will become the key.
 */
export function getKeyForOption<T>({
  option,
  keyForOption,
  labelForOption
}: KeyForOptionConfig<T>) {
  if (keyForOption) {
    return keyForOption(option);
  }

  // @ts-expect-error Accept that the option could have an id
  if (option.id) {
    // @ts-expect-error Accept that the option could have an id
    return `${option.id}`;
  }

  return labelForOption(option);
}

type IsOptionSelectedConfig<T> = {
  option: T;
  keyForOption?: KeyForOption<T>;
  labelForOption: LabelForOption<T>;
  isOptionEqual?: IsOptionEqual<T>;
  value?: T[] | T;
};

/**
 * Determines if is the option is selected given the value.
 *
 * Will prefer to use the `isOptionEqual` to check if the value is
 * selected, otherwise it will fall back to checking the key.
 *
 * Note: always pass along every argument even the optional ones.
 * so `isOptionSelected` can perform its function best.
 */
export function isOptionSelected<T>(
  config: IsOptionSelectedConfig<T>
): boolean {
  const { value } = config;

  if (!value) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((value) => isValueSelected(value, config));
  } else {
    return isValueSelected(value, config);
  }
}

// Helper for isOptionSelected
function isValueSelected<T>(
  value: T,
  config: IsOptionSelectedConfig<T>
): boolean {
  const { option, isOptionEqual, labelForOption, keyForOption } = config;

  if (isOptionEqual) {
    return isOptionEqual(value, option);
  } else {
    const key = getKeyForOption({ option, keyForOption, labelForOption });
    return (
      key === getKeyForOption({ option: value, keyForOption, labelForOption })
    );
  }
}
