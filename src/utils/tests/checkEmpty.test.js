import { checkEmpty } from '../checkEmpty';

describe('checkEmpty function', () => {
  describe('when the given value is "undefined"', () => {
    it('returns true', () => {
      expect(checkEmpty(undefined)).toBeTruthy();
    });
  });

  describe('when the given value is empty string', () => {
    it('returns true', () => {
      expect(checkEmpty('')).toBeTruthy();
    });
  });

  describe('when the given value is "null"', () => {
    it('returns true', () => {
      expect(checkEmpty(null)).toBeTruthy();
    });
  });

  describe('when the given value is non-empty', () => {
    it('returns false', () => {
      expect(checkEmpty('notEmpty')).toBeFalsy();
      expect(checkEmpty({})).toBeFalsy();
      expect(checkEmpty([1])).toBeFalsy();
      expect(checkEmpty(0)).toBeFalsy();
      expect(checkEmpty(false)).toBeFalsy();
      expect(checkEmpty(true)).toBeFalsy();
    });
  });
});
