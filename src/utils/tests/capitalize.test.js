import '../../../test/jest/__mock__';

import { capitalize } from '../capitalize';

import { STRING_CAPITALIZATION_MODES } from '../constants';

const {
  ALL,
  FIRST,
  WORDS,
} = STRING_CAPITALIZATION_MODES;

describe('capitalize function', () => {
  describe('when capitalization mode is FIRST', () => {
    it('the first letter of given string is capitalized', () => {
      const str = 'test string';
      const expected = 'Test string';

      expect(capitalize(str, FIRST)).toEqual(expected);
    });
  });

  describe('when capitalization mode is ALL', () => {
    it('the all letters of given string is capitalized', () => {
      const str = 'test string';
      const expected = 'TEST STRING';

      expect(capitalize(str, ALL)).toEqual(expected);
    });
  });

  describe('when capitalization mode is WORDS', () => {
    it('the first letter of the each word of given string is capitalized', () => {
      const str = 'this iS my Test string';
      const expected = 'This Is My Test String';

      expect(capitalize(str, WORDS)).toEqual(expected);
    });

    it('split words of given string using specified "splitter"', () => {
      const splitter = ',';
      const str = 'this,iS,my,Test,string';
      const expected = 'This,Is,My,Test,String';

      expect(capitalize(str, WORDS, [], splitter)).toEqual(expected);
    });

    it('skips the capitalization of words of given string in the excluded array', () => {
      const excluded = ['iS', 'string'];
      const str = 'this iS my Test string';
      const expected = 'This iS My Test string';

      expect(capitalize(str, WORDS, excluded)).toEqual(expected);
    });
  });
});
