import { getSortQuery } from '../getQueryParts';

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
