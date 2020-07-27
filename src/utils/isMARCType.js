import { MARC_TYPES } from '.';

export const isMARCType = type => Object.values(MARC_TYPES).some(marcType => marcType === type);
