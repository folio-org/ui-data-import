import { STRING_CAPITALIZATION_MODES } from './constants';

const {
  ALL,
  WORDS,
  FIRST,
} = STRING_CAPITALIZATION_MODES;

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
