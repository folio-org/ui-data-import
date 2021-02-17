import { FOLIO_RECORD_TYPES } from './folioRecordTypes';

export const DEFAULT_RECORD_TYPES = {
  MARC_BIBLIOGRAPHIC: FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC,
  MARC_HOLDINGS: FOLIO_RECORD_TYPES.MARC_HOLDINGS,
  MARC_AUTHORITY: FOLIO_RECORD_TYPES.MARC_AUTHORITY,
};

export const INCOMING_RECORD_TYPES = {
  ...DEFAULT_RECORD_TYPES,
  EDIFACT_INVOICE: {
    type: 'EDIFACT_INVOICE',
    captionId: 'ui-data-import.incomingRecordTypes.edifact-invoice',
    iconKey: 'invoices',
  },
};
