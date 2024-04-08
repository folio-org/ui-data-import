import {
  getSortQuery,
  getSearchQuery,
} from '../getQueryParts';

describe('getSortQuery function', () => {
  it('returns sort query string', () => {
    const sortMap = {
      name: 'name',
      folioRecord: 'existingRecordType',
      tags: 'tags.tagList',
      updated: 'metadata.updatedDate',
      updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
    };
    const sortValues1 = 'name,tags';
    const expected1 = `${sortMap.name} ${sortMap.tags}`;
    const sortValues2 = '-name,updated';
    const expected2 = `${sortMap.name}/sort.descending ${sortMap.updated}`;

    expect(getSortQuery(sortMap, sortValues1)).toBe(expected1);
    expect(getSortQuery(sortMap, sortValues2)).toBe(expected2);
  });
});

describe('getSearchQuery function', () => {
  it('should return search query string', () => {
    const queryTemplate = 'name="%{query.query}*"';

    const searchString1 = 'test';
    const searchString2 = 'test*';
    const searchString3 = 'test**';

    const expectedSearchString = 'name="test*"';

    expect(getSearchQuery(queryTemplate, searchString1)).toBe(expectedSearchString);
    expect(getSearchQuery(queryTemplate, searchString2)).toBe(expectedSearchString);
    expect(getSearchQuery(queryTemplate, searchString3)).toBe(expectedSearchString);
  });
});
