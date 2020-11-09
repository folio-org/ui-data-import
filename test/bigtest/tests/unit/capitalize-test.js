import { expect } from 'chai';
import {
  describe,
  it,
} from '@bigtest/mocha';

import {
  capitalize,
  STRING_CAPITALIZATION_MODES,
  STRING_CAPITALIZATION_EXCLUSIONS,
} from '../../../../src/utils';

const {
  ALL,
  WORDS,
  FIRST,
} = STRING_CAPITALIZATION_MODES;
const solidString = 'FIELDNAME';
const complexString = 'FIELD NAME HRID ISBN';

describe('capitalize function', () => {
  describe('capitalizes strings in the following modes:', () => {
    it('ALL: all the characters in the giving string', () => {
      expect(capitalize(solidString.toLocaleLowerCase(), ALL)).to.equal('FIELDNAME');
    });

    it('FIRST: capitalizes the first letter of the given string', () => {
      expect(capitalize(solidString.toLocaleLowerCase(), FIRST)).to.equal('Fieldname');
    });
  });

  describe('capitalizes complex strings with splitters:', () => {
    it('WORDS: splits given string by the given splitter and capitalizes the first letter of each word in the given string', () => {
      expect(capitalize(complexString, WORDS, [], ' ')).to.equal('Field Name Hrid Isbn');
    });

    it('WORDS: capitalizes the first letter of each word in the given string and avoids processing of excluded strings provided', () => {
      expect(capitalize(complexString, WORDS, STRING_CAPITALIZATION_EXCLUSIONS, ' ')).to.equal('Field Name HRID ISBN');
    });
  });
});
