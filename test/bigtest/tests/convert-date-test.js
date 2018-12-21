import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  convertDate,
  DATE_TYPES,
} from '../../../src/components/Jobs/utils';

describe('convertDate', () => {
  describe('converts', () => {
    it('to string', () => {
      const date = 963427676538;

      expect(convertDate(date)).to.be.equal(new Date(date).toString());
    });

    it('to number', () => {
      const date = new Date();

      expect(convertDate(date, DATE_TYPES.number)).to.be.equal(date.valueOf());
    });

    it('to Date', () => {
      const date = 963427676538;

      expect(convertDate(date, DATE_TYPES.Date).valueOf()).to.be.equal(new Date(963427676538).valueOf());
    });
  });

  describe('returns date argument value', () => {
    it('if it is invalid date', () => {
      const invalidDate = 'first of April';

      expect(convertDate(invalidDate)).to.be.equal(invalidDate);
    });

    it('if toType argument is invalid', () => {
      const date = 963427676538;
      const invalidType = 'STRING';

      expect(convertDate(date, invalidType)).to.be.equal(date);
    });
  });
});
