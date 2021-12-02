import { stringToWords } from '../stringToWords';

describe('stringToWords function', () => {
  it('splits given string into words if they can be found', () => {
    const str1 = 'split me into words';
    const expected1 = ['split', 'me', 'into', 'words'];
    const str2 = 'camelCaseWord';
    const expected2 = ['camel', 'Case', 'Word'];
    const str3 = 'react, is,cool';
    const expected3 = ['react', 'is', 'cool'];
    const str4 = 'single-word';
    const expected4 = ['single', 'word'];

    expect(stringToWords(str1)).toEqual(expected1);
    expect(stringToWords(str2)).toEqual(expected2);
    expect(stringToWords(str3)).toEqual(expected3);
    expect(stringToWords(str4)).toEqual(expected4);
    expect(stringToWords('single')).toEqual(['single']);
  });
});
