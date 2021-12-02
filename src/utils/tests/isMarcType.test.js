import '../../../test/jest/__mock__';

import { isMARCType } from '../isMARCType';
import { MARC_TYPES } from '../constants';

describe('isMarcType function', () => {
  it('checks if given value is MARC type', () => {
    expect(isMARCType(MARC_TYPES.MARC_HOLDINGS)).toBeTruthy();
    expect(isMARCType('NOT_MARC_TYPE')).toBeFalsy();
  });
});
