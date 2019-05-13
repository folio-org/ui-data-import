import { STRING_CAPITALIZATION_MODES } from './constants';

const {
  ALL,
  WORDS,
  FIRST,
} = STRING_CAPITALIZATION_MODES;

/**
 * Capitalizes strings in several modes.
 * Recognizes words in the string using splitter char(s).
 * Omits string's words processing listed in excluded list.
 *
 * @param {string} str
 * @param {number} mode
 * @param {array} excluded
 * @param {string} splitter
 * @returns {string}
 */
export const capitalize = (str, mode, excluded = [], splitter = ' ') => {
  switch (mode) {
    case FIRST:
      return `${str.charAt(0).toLocaleUpperCase()}${str.substr(1).toLocaleLowerCase()}`;
    case WORDS:
      return str
        .split(splitter)
        .map(s => {
          if (excluded.includes(s)) {
            return s;
          }

          return `${s.charAt(0).toLocaleUpperCase()}${s.substr(1).toLocaleLowerCase()}`;
        })
        .join(splitter);
    case ALL:
    default:
      return str.toLocaleUpperCase();
  }
};
