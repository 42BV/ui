/**
 * Translation is an object which contains the data needed to make a
 * translation.
 */
export interface Translation {
  /**
   * The unique key of the translation.
   */
  key: string;

  /**
   * Optionally may contain extra data to make the translation more
   * specific. For example may contain the label for the form element
   * which is invalid. Or the number the user entered.
   *
   * You can then use it in your translation: `The ${label} is invalid`
   */
  data?: object;

  /**
   * The fallback string for the translation. Is English but provides
   * a default for when you cannot come up with a translation.
   */
  fallback: string;
}

/**
 * A translator is a function which takes a `Translation` object and
 * converts it into a string.
 */
export type Translator = (translation: Translation) => string;

/**
 * The `translator` which is currently active.
 *
 * Defaults to a translator which returns the `fallback`.
 */
let translator: Translator = translation => translation.fallback;

export function getTranslator(): Translator {
  return translator;
}

/**
 * Lets you set a new translator to be used throughout `@42.nl/ui`.
 *
 * @param {Translator} _translator The new translator
 */
export function setTranslator(_translator: Translator) {
  translator = _translator;
}
