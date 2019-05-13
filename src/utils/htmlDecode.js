/**
 * Decodes and unescapes HTML special characters in the given string.
 *
 * @param {string} input Input string
 * @return {string} Input string with HTML chars decoded
 */
export const htmlDecode = input => {
  return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
};
