import { htmlDecode } from '../htmlDecode';

describe('htmlDecode function', () => {
  it('unescapes HTML characters from given string', () => {
    const htmlString = '<span>This is a sample HTML element</span>';
    const actual = htmlDecode(htmlString);

    expect(actual).toBe('This is a sample HTML element');
  });
});
