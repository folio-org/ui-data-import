import { validateSearchString } from '../validateSearchString';

describe('escapeSearchString function', () => {
  it('should return valid search string', () => {
    const searchString1 = 'test*';
    const searchString2 = '"test"';

    const expectedSearchString1 = 'test\\*';
    const expectedSearchString2 = '\\"test\\"';

    expect(validateSearchString(searchString1)).toBe(expectedSearchString1);
    expect(validateSearchString(searchString2)).toBe(expectedSearchString2);
  });
});
