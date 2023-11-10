import '../../../test/jest/__mock__';

import {
  FIND_ALL_CQL,
  PER_REQUEST_LIMIT,
} from '../constants';
import { getWrapperSourceLink } from '../getWrapperSourceLink';


describe('getWrapperSourceLink function', () => {
  it('should return url with provided limit', () => {
    const providedLimit = 1001;
    const expectedUrl = `/orders/configuration/prefixes?limit=${providedLimit}&query=${FIND_ALL_CQL} sortby name`;

    expect(getWrapperSourceLink('PREFIXES', providedLimit)).toEqual(expectedUrl);
  });

  it('should return url with default limit', () => {
    const expectedUrl = `/orders/configuration/prefixes?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`;

    expect(getWrapperSourceLink('PREFIXES')).toEqual(expectedUrl);
  });
});
