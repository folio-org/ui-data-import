import { DEFAULT_RECORD_TYPES } from './incomingRecordTypes';

export const MATCH_INCOMING_RECORD_TYPES = {
  ...DEFAULT_RECORD_TYPES,
  STATIC_VALUE: {
    type: 'STATIC_VALUE',
    captionId: 'ui-data-import.incomingRecordTypes.static',
    iconKey: '',
  },
};
