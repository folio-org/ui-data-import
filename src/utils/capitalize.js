import { STRING_CAPITALIZATION_MODES } from './constants';

const { ALL, WORDS, FIRST } = STRING_CAPITALIZATION_MODES;

export const capitalize = (str, mode = '', splitter = ' ') => {
  switch (mode) {
    case FIRST:
      return `${str.charAt(0).toLocaleUpperCase()} ${str.substr(1).toLocaleLowerCase()}`;
    case WORDS:
      return str
        .toLocaleLowerCase()
        .split(splitter)
        .map(s => `${s.charAt(0).toLocaleUpperCase()} ${s.substring(1).toLocaleLowerCase()}`)
        .join(splitter);
    case ALL:
    default:
      return str.toLocaleUpperCase();
  }
};
