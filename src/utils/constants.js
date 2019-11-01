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
  COMMITTED: 'COMMITTED',
  ERROR: 'ERROR',
  ERROR_DEFINITION: 'ERROR_DEFINITION',
  DELETING: 'DELETING',
  DISCARDED: 'DISCARDED',
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

export const ENTITY_KEYS = {
  FILE_EXTENSIONS: 'fileExtensions',
  JOB_PROFILES: 'jobProfiles',
  MATCH_PROFILES: 'matchProfiles',
  ACTION_PROFILES: 'actionProfiles',
  MAPPING_PROFILES: 'mappingProfiles',
};

export const PROFILE_TYPES = {
  JOB_PROFILE: 'JOB_PROFILE',
  MATCH_PROFILE: 'MATCH_PROFILE',
  ACTION_PROFILE: 'ACTION_PROFILE',
  MAPPING_PROFILE: 'MAPPING_PROFILE',
};

export const ASSOCIATION_TYPES = {
  jobProfiles: 'JOB_PROFILE',
  matchProfiles: 'MATCH_PROFILE',
  actionProfiles: 'ACTION_PROFILE',
  mappingProfiles: 'MAPPING_PROFILE',
};

export const PROFILE_NAMES = {
  jobProfiles: 'job profile',
  matchProfiles: 'match profile',
  actionProfiles: 'action profile',
  mappingProfiles: 'field mapping profile',
  JOB_PROFILE: 'job profile',
  MATCH_PROFILE: 'match profile',
  ACTION_PROFILE: 'action profile',
  MAPPING_PROFILE: 'field mapping profile',
};

export const LOG_VIEWER = {
  FILTER: {
    OPTIONS: {
      ALL: 0,
      INFO: 1,
      ERRORS: 2,
    },
  },
};

export const FORMS_SETTINGS = {
  [ENTITY_KEYS.MATCH_PROFILES]: {
    MATCHING: {
      QUALIFIER_TYPES: [
        'BEGINS_WITH',
        'ENDS_WITH',
        'CONTAINS',
      ],
      COMPARISON_PARTS: [
        'NUMERICS_ONLY',
        'ALPHANUMERICS_ONLY',
      ],
      CRITERION_TYPES: [
        'EXACTLY_MATCHES',
        'EXISTING_VALUE_CONTAINS_INCOMING_VALUE',
        'INCOMING_VALUE_CONTAINS_EXISTING_VALUE',
        'EXISTING_VALUE_BEGINS_WITH_INCOMING_VALUE',
        'INCOMING_VALUE_BEGINS_WITH_EXISTING_VALUE',
        'EXISTING_VALUE_ENDS_WITH_INCOMING_VALUE',
        'INCOMING_VALUE_ENDS_WITH_EXISTING_VALUE',
      ],
      VALUE_TYPES: [
        'VALUE_FROM_RECORD',
        'STATIC_VALUE',
      ],
      STATIC_VALUE_TYPES: [
        'TEXT',
        'NUMBER',
        'DATE',
      ],
    },
  },
};
