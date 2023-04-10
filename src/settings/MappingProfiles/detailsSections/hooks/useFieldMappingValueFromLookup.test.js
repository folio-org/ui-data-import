import { renderHook } from '@testing-library/react-hooks';

import '../../../../../test/jest/__mock__';

import { VENDOR_FIELD } from '../../../../utils';
import { useFieldMappingValueFromLookup } from './useFieldMappingValueFromLookup';

const mappingQuery = '245$a; else';
const vendorId = '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1';

jest.mock('./useFieldMappingFieldValue', () => ({
  useFieldMappingFieldValue: () => `${mappingQuery} "${vendorId}"`,
}));

jest.mock('../utils', () => ({
  getMappingQueryFromValue: () => mappingQuery,
  getMatchByUuidInQuotes: () => vendorId,
}));

describe('useFieldMappingValueFromLookup hook', () => {
  it('should return correct value', () => {
    const { result } = renderHook(() => useFieldMappingValueFromLookup(VENDOR_FIELD));
    const [receivedId, receivedMapping] = result.current;

    expect(receivedId).toEqual(vendorId);
    expect(receivedMapping).toEqual(mappingQuery);
  });
});
