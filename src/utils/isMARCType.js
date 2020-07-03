import { MARC_TYPES } from '.';

export const isMARCType = type => MARC_TYPES.some(marcType => marcType === type);
