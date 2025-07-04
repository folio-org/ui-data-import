import { MARC_TYPES } from './constants';

export const isMARCType = type => Object.values(MARC_TYPES).some(marcType => marcType === type);
