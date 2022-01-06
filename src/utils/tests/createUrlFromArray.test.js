import '../../../test/jest/__mock__';

import { createUrlFromArray } from '../createUrlFromArray';

describe('createUrlFromArray function', () => {
  describe('when ulr without question mark at the end', () => {
    it('url should be just concatenate with url params, joined with ampersand symbol', () => {
      const url = 'www.test.com';
      const testParam = [
        'testProp=testValue',
        'anotherProp=anotherValue',
      ];
      const expected = 'www.test.com?testProp=testValue&anotherProp=anotherValue';

      expect(createUrlFromArray(url, testParam)).toEqual(expected);
    });
  });

  describe('when ulr with question mark at the end', () => {
    it('url still should be just concatenate with url params with only one question mark between them', () => {
      const url = 'www.test.com?';
      const testParam = [
        'testProp=testValue',
        'anotherProp=anotherValue',
      ];
      const expected = 'www.test.com?testProp=testValue&anotherProp=anotherValue';

      expect(createUrlFromArray(url, testParam)).toEqual(expected);
    });
  });

  describe('when there is no url params passed', () => {
    it('should just url with question mark at the end of string', () => {
      const url = 'www.test.com';
      const expected = 'www.test.com?';

      expect(createUrlFromArray(url)).toEqual(expected);
    });
  });
});
