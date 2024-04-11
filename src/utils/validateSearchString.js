/**
 * Escapes unescaped asterisks and double quotes
 *
 * @param {string} searchString
 * @returns {string}
 *
 * @example
 *
 * validateSearchString('test*')
 * // => test\*
 *
 * validateSearchString('"test"')
 * // => \"test\"
 */
export const validateSearchString = searchString => {
  return searchString.replace(/(?<!\\)\*/g, '\\*').replace(/(?<!\\)"/g, '\\"');
};
