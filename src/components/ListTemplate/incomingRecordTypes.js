import { FOLIO_RECORD_TYPES } from './folioRecordTypes';

export const INCOMING_RECORD_TYPES = {
  MARC_BIBLIOGRAPHIC: FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC,
  MARC_HOLDINGS: FOLIO_RECORD_TYPES.MARC_HOLDINGS,
  MARC_AUTHORITY: FOLIO_RECORD_TYPES.MARC_AUTHORITY,
  EDIFACT_INVOICE: {
    type: 'EDIFACT_INVOICE',
    captionId: 'ui-data-import.incomingRecordTypes.edifact-invoice',
    iconKey: 'invoices',
  },
  DELIMITED: {
    type: 'DELIMITED',
    captionId: 'ui-data-import.incomingRecordTypes.delimited',
    iconKey: '',
  },
  STATIC_VALUE: {
    type: 'STATIC_VALUE',
    captionId: 'ui-data-import.incomingRecordTypes.static',
    iconKey: '',
  },
};
