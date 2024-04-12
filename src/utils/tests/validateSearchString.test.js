import { validateSearchString } from '../validateSearchString';

describe('validateSearchString function', () => {
  it('should return valid search string', () => {
    const searchString1 = 'test';
    const searchString2 = 'test*';
    const searchString3 = 'test**';

    const expectedSearchString = 'test';

    expect(validateSearchString(searchString1)).toBe(expectedSearchString);
    expect(validateSearchString(searchString2)).toBe(expectedSearchString);
    expect(validateSearchString(searchString3)).toBe(expectedSearchString);
  });
});
