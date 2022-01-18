import { omit } from 'lodash';
import { FOLIO_RECORD_TYPES } from './folioRecordTypes';

export const ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES = {
  ...omit(FOLIO_RECORD_TYPES, FOLIO_RECORD_TYPES.AUTHORITY.type),
  MARC_AUTHORITY: {
    ...FOLIO_RECORD_TYPES.MARC_AUTHORITY,
    captionId: 'ui-data-import.actionProfilesForm.recordTypes.marc-auth',
  },
  MARC_BIBLIOGRAPHIC: {
    ...FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC,
    captionId: 'ui-data-import.actionProfilesForm.recordTypes.marc-bib',
  },
  MARC_HOLDINGS: {
    ...FOLIO_RECORD_TYPES.MARC_HOLDINGS,
    captionId: 'ui-data-import.actionProfilesForm.recordTypes.marc-hold',
  },
};
