import { htmlDecode } from '../htmlDecode';

describe('htmlDecode function', () => {
  it('unescapes and decodes HTML characters from given string', () => {
    const htmlString = '<span>This is a copyright HTML element &rarr;&nbsp;&copy;</span>';
    const actual = htmlDecode(htmlString);

    expect(actual).toBe('This is a copyright HTML element → ©');
  });
});
