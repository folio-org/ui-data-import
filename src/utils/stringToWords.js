/**
 * Splits given string into words if they can be found in.
 *
 * @param {String} input
 * @returns {Array}
 */
export const stringToWords = input => {
  return input.match(/[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g);
};
