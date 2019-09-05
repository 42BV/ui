import { getTranslator, Translation } from './translator';

/**
 * The translation function (abbreviated as `t` for convenience) is
 * a small utility function that enables the user to make use of
 * the defined translation interface in @see Translation.
 *
 *
 *
 * @example basic example
 * ```ts
 * const someFunction(name: string): string {
 *  return t({
 *    key: 'TRANSLATION_KEY',
 *    data: { name },
 *    fallback: `${name} is already taken.`
 *    overrideText: 'Test'
 *  })
 * }
 * ```
 *
 * @export
 * @param {string} overrideText text that overrides translation functionality
 * @param {Translation} translation object used for the translation process
 * @returns
 */
export function t({
  overrideText,
  ...translation
}: Translation & { overrideText?: string }) {
  if (overrideText) {
    return overrideText;
  }

  return getTranslator()(translation);
}
