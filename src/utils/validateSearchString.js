/**
 * Checks if search string contains astersisks in the end and removes them
 *
 * @param {string} searchString
 * @returns {string}
 *
 * @example
 *
 * validateSearchString('test')
 * // => test
 *
 * validateSearchString('test*')
 * // => test
 *
 * validateSearchString('test**')
 * // => test
 */
export const validateSearchString = searchString => {
  const containsAsterisks = /\*+$/g;
  const isValidSearchString = !containsAsterisks.test(searchString);

  return isValidSearchString ? searchString : searchString.replace(containsAsterisks, '');
};
