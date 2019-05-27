export const DEFAULT_FETCHER_UPDATE_INTERVAL = 5000;
export const DEFAULT_TIMEOUT_BEFORE_FILE_DELETION = 0;

export const STRING_CAPITALIZATION_MODES = {
  ALL: 0,
  FIRST: 1,
  WORDS: 2,
};

export const STRING_CAPITALIZATION_EXCLUSIONS = [
  'ID', 'HRID', 'MARC', 'ISBN', 'PO', 'TBD',
];

export const HTML_LANG_DIRECTIONS = {
  LEFT_TO_RIGHT: 'ltr',
  RIGHT_TO_LEFT: 'rtl',
};

export const SORT_TYPES = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

export const UPLOAD_DEFINITION_STATUSES = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  LOADED: 'LOADED',
};

export const FILE_STATUSES = {
  NEW: 'NEW',
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED',
  ERROR: 'ERROR',
  ERROR_DEFINITION: 'ERROR_DEFINITION',
  DELETING: 'DELETING',
};

export const JOB_STATUSES = {
  PREPARING_FOR_PREVIEW: 'PREPARING_FOR_PREVIEW',
  READY_FOR_PREVIEW: 'READY_FOR_PREVIEW',
  RUNNING: 'RUNNING',
};

export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
export const SYSTEM_USER_NAME = 'System';

export const DATA_TYPES = [
  'MARC',
  'Delimited',
  'EDIFACT',
];

export const LAYER_TYPES = {
  CREATE: 'create',
  EDIT: 'edit',
  DUPLICATE: 'duplicate',
};

export const ENTITY_CONFIGS = {
  FILE_EXTENSIONS: { ENTITY_KEY: 'fileExtensions' },
  JOB_PROFILES: { ENTITY_KEY: 'jobProfiles' },
  MATCH_PROFILES: {
    ENTITY_KEY: 'matchProfiles',
    RECORD_TYPES: {
      ORDER: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.order',
        icon: 'orders',
      },
      INVOICE: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.invoice',
        icon: 'invoices',
      },
      ITEM: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.item',
        icon: 'items',
      },
      INSTANCE: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.instance',
        icon: 'instances',
      },
      HOLDINGS: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.holding',
        icon: 'holdings',
      },
      MARC_BIBLIOGRAPHIC: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.marc-bib',
        icon: 'marcBibs',
      },
      MARC_AUTHORITY: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.marc-auth',
        icon: 'marcAuthorities',
      },
      MARC_HOLDINGS: {
        caption: 'ui-data-import.settings.matchProfiles.recordTypes.marc-hold',
        icon: 'marcHoldings',
      },
    },
  },
  ACTION_PROFILES: { ENTITY_KEY: 'actionProfiles' },
  MAPPING_PROFILES: { ENTITY_KEY: 'mappingProfiles' },
};
