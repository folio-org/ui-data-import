import { trimSearchTerm } from '../trimSearchTerm';

describe('trimSearchTerm function', () => {
  it('removes white spaces and "*" symbols from both sides of string', () => {
    const searchTerm1 = '  ***someTerm**';

    expect(trimSearchTerm(searchTerm1)).toBe('someTerm');
  });
});
