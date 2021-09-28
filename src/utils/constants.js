export const FIND_ALL_CQL = 'cql.allRecords=1';

export const DEFAULT_TIMEOUT_BEFORE_FILE_DELETION = 0;

export const DEFAULT_TIMEOUT_BEFORE_JOB_DELETION = 10000;

export const STRING_CAPITALIZATION_MODES = {
  ALL: 0,
  FIRST: 1,
  WORDS: 2,
};

export const AVAILABLE_PLACEMENTS = [
  'bottom',
  'top',
  'left',
  'right',
  'top-start',
  'top-end',
  'bottom-start',
  'bottom-end',
  'left-start',
  'left-end',
  'right-start',
  'right-end',
];

export const STRING_CAPITALIZATION_EXCLUSIONS = [
  'ID', 'HRID', 'MARC', 'ISBN', 'PO', 'TBD',
];

export const HTML_LANG_DIRECTIONS = {
  LEFT_TO_RIGHT: 'ltr',
  RIGHT_TO_LEFT: 'rtl',
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

export const DEFAULT_JOB_LOG_COLUMNS = [
  'fileName',
  'status',
  'totalRecords',
  'jobProfileName',
  'completedDate',
  'runBy',
  'hrId',
];

export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
export const SYSTEM_USER_NAME = 'System';

export const CURRENCY_FIELD = 'currency';
export const VENDOR_ID_FIELD = 'vendorId';
export const LOCK_TOTAL_FIELD = 'lockTotal';
export const EXCHANGE_RATE_FIELD = 'exchangeRate';

export const DATA_TYPES = [
  'MARC',
  'EDIFACT',
];

export const MARC_TYPES = {
  MARC_BIBLIOGRAPHIC: 'MARC_BIBLIOGRAPHIC',
  MARC_HOLDINGS: 'MARC_HOLDINGS',
  MARC_AUTHORITY: 'MARC_AUTHORITY',
};

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

export const PROFILE_TYPES_FOR_URL = {
  jobProfiles: 'job-profiles',
  matchProfiles: 'match-profiles',
  actionProfiles: 'action-profiles',
  mappingProfiles: 'mapping-profiles',
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

export const PROFILE_LABEL_IDS = {
  matchProfiles: 'ui-data-import.matchProfileName',
  actionProfiles: 'ui-data-import.actionProfileName',
  jobProfiles: 'ui-data-import.jobProfileName',
  mappingProfiles: 'ui-data-import.mappingProfileName',
};

export const LOG_VIEWER = {
  FILTER: {
    OPTIONS: {
      SRS_MARC_BIB: 0,
      INSTANCE: 1,
      HOLDINGS: 2,
      ITEM: 3,
      ORDER: 4,
      INVOICE: 5,
    },
  },
};

export const MARC_FIELD_CONSTITUENT = {
  FIELD: 'field',
  INDICATOR1: 'indicator1',
  INDICATOR2: 'indicator1',
  SUBFIELD: 'subfield',
};

export const QUALIFIER_TYPES = {
  BEGINS_WITH: 'BEGINS_WITH',
  ENDS_WITH: 'ENDS_WITH',
  CONTAINS: 'CONTAINS',
};

export const COMPARISON_PARTS = {
  NUMERICS_ONLY: 'NUMERICS_ONLY',
  ALPHANUMERICS_ONLY: 'ALPHANUMERICS_ONLY',
};

export const CRITERION_TYPES = {
  EXACTLY_MATCHES: 'EXACTLY_MATCHES',
  EXISTING_VALUE_CONTAINS_INCOMING_VALUE: 'EXISTING_VALUE_CONTAINS_INCOMING_VALUE',
  INCOMING_VALUE_CONTAINS_EXISTING_VALUE: 'INCOMING_VALUE_CONTAINS_EXISTING_VALUE',
  EXISTING_VALUE_BEGINS_WITH_INCOMING_VALUE: 'EXISTING_VALUE_BEGINS_WITH_INCOMING_VALUE',
  INCOMING_VALUE_BEGINS_WITH_EXISTING_VALUE: 'INCOMING_VALUE_BEGINS_WITH_EXISTING_VALUE',
  EXISTING_VALUE_ENDS_WITH_INCOMING_VALUE: 'EXISTING_VALUE_ENDS_WITH_INCOMING_VALUE',
  INCOMING_VALUE_ENDS_WITH_EXISTING_VALUE: 'INCOMING_VALUE_ENDS_WITH_EXISTING_VALUE',
};

export const COMPARISON_PARTS_OPTIONS = [
  {
    value: COMPARISON_PARTS.NUMERICS_ONLY,
    label: 'ui-data-import.match.comparison-part.numerics-only',
  }, {
    value: COMPARISON_PARTS.ALPHANUMERICS_ONLY,
    label: 'ui-data-import.match.comparison-part.alpha-numerics-only',
  },
];

export const QUALIFIER_TYPES_OPTIONS = [
  {
    value: QUALIFIER_TYPES.BEGINS_WITH,
    label: 'ui-data-import.match.qualifier.begins-with',
  }, {
    value: QUALIFIER_TYPES.ENDS_WITH,
    label: 'ui-data-import.match.qualifier.ends-with',
  }, {
    value: QUALIFIER_TYPES.CONTAINS,
    label: 'ui-data-import.match.qualifier.contains',
  },
];

export const CRITERION_TYPES_OPTIONS = [
  {
    value: CRITERION_TYPES.EXACTLY_MATCHES,
    label: 'ui-data-import.match.criterion-type.exactly-matches',
  }, {
    value: CRITERION_TYPES.EXISTING_VALUE_CONTAINS_INCOMING_VALUE,
    label: 'ui-data-import.match.criterion-type.existing-contains-incoming',
  }, {
    value: CRITERION_TYPES.INCOMING_VALUE_CONTAINS_EXISTING_VALUE,
    label: 'ui-data-import.match.criterion-type.incoming-contains-existing',
  }, {
    value: CRITERION_TYPES.EXISTING_VALUE_BEGINS_WITH_INCOMING_VALUE,
    label: 'ui-data-import.match.criterion-type.existing-begins-with-incoming',
  }, {
    value: CRITERION_TYPES.INCOMING_VALUE_BEGINS_WITH_EXISTING_VALUE,
    label: 'ui-data-import.match.criterion-type.incoming-begins-with-existing',
  }, {
    value: CRITERION_TYPES.EXISTING_VALUE_ENDS_WITH_INCOMING_VALUE,
    label: 'ui-data-import.match.criterion-type.existing-ends-with-incoming',
  }, {
    value: CRITERION_TYPES.INCOMING_VALUE_ENDS_WITH_EXISTING_VALUE,
    label: 'ui-data-import.match.criterion-type.incoming-ends-with-existing',
  },
];

export const VALUE_TYPES = [
  {
    value: 'VALUE_FROM_RECORD',
    label: 'ui-data-import.match.value-type.value-from-record',
  }, {
    value: 'STATIC_VALUE',
    label: 'ui-data-import.match.value-type.static-value',
  },
];

export const BOOLEAN_ACTIONS = {
  ALL_TRUE: 'ALL_TRUE',
  ALL_FALSE: 'ALL_FALSE',
  AS_IS: 'AS_IS',
  IGNORE: 'IGNORE',
};

export const REPEATABLE_ACTIONS = {
  EXTEND_EXISTING: 'EXTEND_EXISTING',
  DELETE_EXISTING: 'DELETE_EXISTING',
  EXCHANGE_EXISTING: 'EXCHANGE_EXISTING',
  DELETE_INCOMING: 'DELETE_INCOMING',
};

export const FUND_DISTRIBUTION_SOURCE = {
  USE_FUND_DISTRIBUTION_FROM_POL: '{POL_FUND_DISTRIBUTIONS}',
  USE_FUND_DISTRIBUTION_FIELD_MAPPINGS: '""',
};

export const STATIC_VALUE_TYPES = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  EXACT_DATE: 'EXACT_DATE',
  DATE_RANGE: 'DATE_RANGE',
};

export const RESTRICTED_MATCHING_MARC_FIELD_VALUE = [
  'LDR', '001', '002', '003', '004', '005', '006', '007', '008', '009',
];

export const FORMS_SETTINGS = {
  [ENTITY_KEYS.MATCH_PROFILES]: {
    MATCHING: {
      QUALIFIER_TYPES: [
        QUALIFIER_TYPES.BEGINS_WITH,
        QUALIFIER_TYPES.ENDS_WITH,
        QUALIFIER_TYPES.CONTAINS,
      ],
      COMPARISON_PARTS: [
        COMPARISON_PARTS.NUMERICS_ONLY,
        COMPARISON_PARTS.ALPHANUMERICS_ONLY,
      ],
      CRITERION_TYPES: [
        CRITERION_TYPES.EXACTLY_MATCHES,
        CRITERION_TYPES.EXISTING_VALUE_CONTAINS_INCOMING_VALUE,
        CRITERION_TYPES.INCOMING_VALUE_CONTAINS_EXISTING_VALUE,
        CRITERION_TYPES.EXISTING_VALUE_BEGINS_WITH_INCOMING_VALUE,
        CRITERION_TYPES.INCOMING_VALUE_BEGINS_WITH_EXISTING_VALUE,
        CRITERION_TYPES.EXISTING_VALUE_ENDS_WITH_INCOMING_VALUE,
        CRITERION_TYPES.INCOMING_VALUE_ENDS_WITH_EXISTING_VALUE,
      ],
      VALUE_TYPES: [
        'VALUE_FROM_RECORD',
        'STATIC_VALUE',
      ],
      STATIC_VALUE_TYPES: [
        STATIC_VALUE_TYPES.TEXT,
        STATIC_VALUE_TYPES.NUMBER,
        STATIC_VALUE_TYPES.EXACT_DATE,
        STATIC_VALUE_TYPES.DATE_RANGE,
      ],
    },
  },
  [ENTITY_KEYS.MAPPING_PROFILES]: {
    DECORATORS: {
      REPEATABLE_ACTIONS: [
        {
          label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.extendExisting',
          value: REPEATABLE_ACTIONS.EXTEND_EXISTING,
        },
        {
          label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.deleteExisting',
          value: REPEATABLE_ACTIONS.DELETE_EXISTING,
        },
        {
          label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.exchangeExisting',
          value: REPEATABLE_ACTIONS.EXCHANGE_EXISTING,
        },
        {
          label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.deleteIncoming',
          value: REPEATABLE_ACTIONS.DELETE_INCOMING,
        },
      ],
      DATE_PICKER: {
        TODAY: {
          value: 'TODAY',
          id: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues.today',
        },
        CHOOSE_DATE: {
          value: 'CHOOSE_DATE',
          id: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues.chooseDate',
        },
      },
      BOOLEAN_ACTIONS: [
        {
          label: 'ui-data-import.settings.mappingProfiles.map.administrativeData.field.markAllAffectedRecords',
          value: BOOLEAN_ACTIONS.ALL_TRUE,
        },
        {
          label: 'ui-data-import.settings.mappingProfiles.map.administrativeData.field.unmarkAllAffectedRecords',
          value: BOOLEAN_ACTIONS.ALL_FALSE,
        },
        {
          label: 'ui-data-import.settings.mappingProfiles.map.administrativeData.field.keepAllAffectedRecords',
          value: BOOLEAN_ACTIONS.AS_IS,
        },
      ],
    },
  },
};

export const MAPPING_REPEATABLE_FIELD_ACTIONS = [
  {
    label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.extendExisting',
    value: REPEATABLE_ACTIONS.EXTEND_EXISTING,
  },
  {
    label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.deleteExisting',
    value: REPEATABLE_ACTIONS.DELETE_EXISTING,
  },
  {
    label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.exchangeExisting',
    value: REPEATABLE_ACTIONS.EXCHANGE_EXISTING,
  },
  {
    label: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions.deleteIncoming',
    value: REPEATABLE_ACTIONS.DELETE_INCOMING,
  },
];

export const MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES = [
  {
    label: 'ui-data-import.settings.mappingProfiles.map.wrapper.fundDistributionSource.useFundDistributionFromPOL',
    value: FUND_DISTRIBUTION_SOURCE.USE_FUND_DISTRIBUTION_FROM_POL,
  },
  {
    label: 'ui-data-import.settings.mappingProfiles.map.wrapper.fundDistributionSource.useFundDistributionFieldMappings',
    value: FUND_DISTRIBUTION_SOURCE.USE_FUND_DISTRIBUTION_FIELD_MAPPINGS,

  },
];

export const PROFILE_LINKING_RULES = {
  allowDelete: false,
  deleteRecursive: false,
  allowUnlink: true,
  unlinkRecursive: false,
  profilesAllowed: [
    ENTITY_KEYS.MATCH_PROFILES,
    ENTITY_KEYS.ACTION_PROFILES,
  ],
  columnsAllowed: {
    [ENTITY_KEYS.MATCH_PROFILES]: [
      'name',
      'match',
    ],
    [ENTITY_KEYS.ACTION_PROFILES]: [
      'name',
      'action',
    ],
  },
  childrenAllowed: [ENTITY_KEYS.MATCH_PROFILES],
  siblingsProhibited: { [ENTITY_KEYS.ACTION_PROFILES]: [ENTITY_KEYS.MATCH_PROFILES] },
};

export const PROFILE_RELATION_TYPES = {
  NONE: null,
  MATCH: 'MATCH',
  NON_MATCH: 'NON_MATCH',
};

export const INSTANCE_RESOURCE_PATHS = [
  'raml-util/schemas/metadata.schema',
  'instance.json',
  'instancerelationship.json',
  'instanceprecedingsucceedingtitle.json',
];

export const HOLDINGS_RESOURCE_PATHS = [
  'raml-util/schemas/metadata.schema',
  'holdingsrecord.json',
];

export const ITEM_RESOURCE_PATHS = [
  'raml-util/schemas/metadata.schema',
  'item.json',
];

export const ORDER_RESOURCE_PATHS = [
  'raml-util/schemas/metadata.schema',
  'acq-models/mod-orders-storage/schemas/purchase_order.json',
  'acq-models/mod-orders-storage/schemas/ongoing.json',
  'acq-models/mod-orders-storage/schemas/po_line.json',
  'acq-models/mod-orders-storage/schemas/details.json',
  'acq-models/mod-orders-storage/schemas/product_identifier.json',
  'acq-models/mod-orders-storage/schemas/contributor.json',
  'acq-models/mod-orders-storage/schemas/receiving_history.json',
  'acq-models/mod-orders-storage/schemas/cost.json',
  'acq-models/mod-orders-storage/schemas/fund_distribution.json',
  'acq-models/mod-orders-storage/schemas/location.json',
  'acq-models/mod-orders-storage/schemas/physical.json',
  'acq-models/mod-orders-storage/schemas/eresource.json',
  'acq-models/mod-orders-storage/schemas/vendor_detail.json',
];

export const NOTES_RESOURCE_PATHS = ['types/notes/note.json'];

export const INVOICE_RESOURCE_PATHS = [
  'raml-util/schemas/metadata.schema',
  'acq-models/mod-invoice-storage/schemas/invoice.json',
  'acq-models/mod-invoice-storage/schemas/adjustment.json',
  'acq-models/mod-invoice-storage/schemas/document_metadata.json',
  'acq-models/mod-invoice-storage/schemas/invoice_line.json',
  'acq-models/mod-invoice-storage/schemas/fund_distribution.json',
];

export const FILTER_QUERY_PARAMS = {
  DEFAULT: 'cql.allRecords=1',
  NOT_STATIC_VALUE: 'cql.allRecords=1 NOT incomingRecordType=STATIC_VALUE',
};

export const FIELD_MAPPINGS_FOR_MARC = {
  MODIFICATIONS: 'MODIFY',
  UPDATES: 'UPDATE',
};

export const FIELD_MAPPINGS_FOR_MARC_OPTIONS = [
  {
    value: FIELD_MAPPINGS_FOR_MARC.MODIFICATIONS,
    label: 'ui-data-import.fieldMappingsForMarc.modifications',
  }, {
    value: FIELD_MAPPINGS_FOR_MARC.UPDATES,
    label: 'ui-data-import.fieldMappingsForMarc.updates',
  },
];

export const MAPPING_DETAILS_ACTIONS = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
  MOVE: 'MOVE',
};

export const MAPPING_DETAILS_SUBACTIONS = {
  ADD_SUBFIELD: 'ADD_SUBFIELD',
  INSERT: 'INSERT',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE',
  NEW_FIELD: 'CREATE_NEW_FIELD',
  EXISTING_FIELD: 'ADD_TO_EXISTING_FIELD',
};

export const MAPPING_DETAILS_POSITION = {
  BEFORE_STRING: 'BEFORE_STRING',
  AFTER_STRING: 'AFTER_STRING',
  NEW_SUBFIELD: 'NEW_SUBFIELD',
};

export const PRORATE_OPTIONS = {
  BY_LINE: 'By line',
  BY_AMOUNT: 'By amount',
  BY_QUANTITY: 'By quantity',
  NOT_PRORATED: 'Not prorated',
};

export const ACTION_OPTIONS = [
  {
    value: MAPPING_DETAILS_ACTIONS.ADD,
    label: 'ui-data-import.settings.mappingProfile.marcTable.action.add',
  }, {
    value: MAPPING_DETAILS_ACTIONS.DELETE,
    label: 'ui-data-import.settings.mappingProfile.marcTable.action.delete',
  }, {
    value: MAPPING_DETAILS_ACTIONS.EDIT,
    label: 'ui-data-import.settings.mappingProfile.marcTable.action.edit',
  }, {
    value: MAPPING_DETAILS_ACTIONS.MOVE,
    label: 'ui-data-import.settings.mappingProfile.marcTable.action.move',
  },
];

export const SUBACTION_OPTIONS = [
  {
    value: MAPPING_DETAILS_SUBACTIONS.ADD_SUBFIELD,
    label: 'ui-data-import.settings.mappingProfile.marcTable.subaction.addSubfield',
  }, {
    value: MAPPING_DETAILS_SUBACTIONS.INSERT,
    label: 'ui-data-import.settings.mappingProfile.marcTable.subaction.insert',
  }, {
    value: MAPPING_DETAILS_SUBACTIONS.REMOVE,
    label: 'ui-data-import.settings.mappingProfile.marcTable.subaction.remove',
  }, {
    value: MAPPING_DETAILS_SUBACTIONS.REPLACE,
    label: 'ui-data-import.settings.mappingProfile.marcTable.subaction.replace',
  }, {
    value: MAPPING_DETAILS_SUBACTIONS.NEW_FIELD,
    label: 'ui-data-import.settings.mappingProfile.marcTable.subaction.newField',
  }, {
    value: MAPPING_DETAILS_SUBACTIONS.EXISTING_FIELD,
    label: 'ui-data-import.settings.mappingProfile.marcTable.subaction.existingField',
  },
];

export const POSITION_OPTIONS = [
  {
    value: MAPPING_DETAILS_POSITION.BEFORE_STRING,
    label: 'ui-data-import.settings.mappingProfile.marcTable.position.before',
  }, {
    value: MAPPING_DETAILS_POSITION.AFTER_STRING,
    label: 'ui-data-import.settings.mappingProfile.marcTable.position.after',
  }, {
    value: MAPPING_DETAILS_POSITION.NEW_SUBFIELD,
    label: 'ui-data-import.settings.mappingProfile.marcTable.position.newSubfield',
  },
];

export const MARC_TABLE_CONFIG = {
  allowedSubactions: {
    ADD: [MAPPING_DETAILS_SUBACTIONS.ADD_SUBFIELD],
    DELETE: [],
    EDIT: [MAPPING_DETAILS_SUBACTIONS.INSERT, MAPPING_DETAILS_SUBACTIONS.REMOVE, MAPPING_DETAILS_SUBACTIONS.REPLACE],
    MOVE: [MAPPING_DETAILS_SUBACTIONS.NEW_FIELD, MAPPING_DETAILS_SUBACTIONS.EXISTING_FIELD],
  },
  allowedPositions: { EDIT: { INSERT: [MAPPING_DETAILS_POSITION.BEFORE_STRING, MAPPING_DETAILS_POSITION.AFTER_STRING, MAPPING_DETAILS_POSITION.NEW_SUBFIELD] } },
  hasDataField: {
    ADD: true,
    DELETE: false,
    EDIT: true,
    MOVE: true,
  },
};

export const ITEM_CIRCULATION_NOTES_OPTIONS = [
  {
    value: 'Check in',
    label: 'ui-data-import.settings.mappingProfiles.map.item.field.circulationNotes.checkInNote',
  },
  {
    value: 'Check out',
    label: 'ui-data-import.settings.mappingProfiles.map.item.field.circulationNotes.checkOutNote',
  },
];

export const ITEM_STATUS_OPTIONS = [
  {
    value: 'Available',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.available',
  }, {
    value: 'In process',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.inProcess',
  }, {
    value: 'In process (non-requestable)',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.inProcessNonRequestable',
  }, {
    value: 'In transit',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.inTransit',
  }, {
    value: 'Intellectual item',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.intellectualItem',
  }, {
    value: 'Long missing',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.longMissing',
  }, {
    value: 'Missing',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.missing',
  }, {
    value: 'On order',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.onOrder',
  }, {
    value: 'Order closed',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.orderClosed',
  }, {
    value: 'Restricted',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.restricted',
  }, {
    value: 'Unavailable',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.unavailable',
  }, {
    value: 'Unknown',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.unknown',
  }, {
    value: 'Withdrawn',
    label: 'ui-data-import.settings.mappingProfiles.map.item.status.withdrawn',
  },
];

export const INOVOICE_ADJUSTMENTS_PRORATE_OPTIONS = [
  {
    value: PRORATE_OPTIONS.BY_LINE,
    label: 'ui-data-import.settings.mappingProfiles.map.invoice.invoiceAdjustments.field.prorate.ByLine',
  }, {
    value: PRORATE_OPTIONS.BY_AMOUNT,
    label: 'ui-data-import.settings.mappingProfiles.map.invoice.invoiceAdjustments.field.prorate.ByAmount',
  }, {
    value: PRORATE_OPTIONS.BY_QUANTITY,
    label: 'ui-data-import.settings.mappingProfiles.map.invoice.invoiceAdjustments.field.prorate.ByQuantity',
  }, {
    value: PRORATE_OPTIONS.NOT_PRORATED,
    label: 'ui-data-import.settings.mappingProfiles.map.invoice.invoiceAdjustments.field.prorate.NotProrated',
  },
];

export const INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS = [
  {
    value: 'In addition to',
    label: 'ui-data-import.settings.mappingProfiles.map.invoice.invoiceAdjustments.field.prorate.InAdditionTo',
  }, {
    value: 'Included in',
    label: 'ui-data-import.settings.mappingProfiles.map.invoice.invoiceAdjustments.field.prorate.IncludedIn',
  }, {
    value: 'Separate from',
    label: 'ui-data-import.settings.mappingProfiles.map.invoice.invoiceAdjustments.field.prorate.SeparateFrom',
  },
];

export const MAPPING_DETAILS_HEADLINE = {
  INSTANCE: {
    label: 'Instance',
    labelId: 'ui-data-import.settings.mappingProfiles.map.instance',
  },
  HOLDINGS: {
    label: 'Holdings',
    labelId: 'ui-data-import.settings.mappingProfiles.map.holdings',
  },
  ITEM: {
    label: 'Item',
    labelId: 'ui-data-import.settings.mappingProfiles.map.item',
  },
  ORDER: {
    label: 'Order',
    labelId: 'ui-data-import.settings.mappingProfiles.map.order',
  },
  INVOICE: {
    label: 'Invoice',
    labelId: 'ui-data-import.settings.mappingProfiles.map.invoice',
  },
  MARC_BIBLIOGRAPHIC: {
    label: 'MARC Bibliographic',
    labelId: 'ui-data-import.settings.mappingProfiles.map.marcBib',
  },
  MARC_HOLDINGS: {
    label: 'MARC Holdings',
    labelId: 'ui-data-import.settings.mappingProfiles.map.marcHoldings',
  },
  MARC_AUTHORITY: {
    label: 'MARC Authority',
    labelId: 'ui-data-import.settings.mappingProfiles.map.marcAuthority',
  },
};

export const MARC_FIELD_PROTECTION_SOURCE = {
  SYSTEM: {
    value: 'SYSTEM',
    labelId: 'ui-data-import.settings.marcFieldProtection.system',
  },
  USER: {
    value: 'USER',
    labelId: 'ui-data-import.settings.marcFieldProtection.user',
  },
};

export const MARC_FIELD_PROTECTION_ALLOWED_FIELD_VALUES = ['*', '005'];

// TODO: Options to disable until functionality is not implemented.
// Should be removed in the future
export const FOLIO_RECORD_TYPES_TO_DISABLE = ['MARC_HOLDINGS', 'ORDER', 'MARC_AUTHORITY'];
export const INCOMING_RECORD_TYPES_TO_DISABLE = ['MARC_HOLDINGS', 'MARC_AUTHORITY'];

export const OCLC_CREATE_INSTANCE_JOB_ID = 'd0ebb7b0-2f0f-11eb-adc1-0242ac120002';
export const OCLC_UPDATE_INSTANCE_JOB_ID = '91f9b8d6-d80e-4727-9783-73fb53e3c786';
export const OCLC_MATCH_EXISTING_SRS_RECORD_ID = 'd27d71ce-8a1e-44c6-acea-96961b5592c6';
export const OCLC_MATCH_NO_SRS_RECORD_ID = '31dbb554-0826-48ec-a0a4-3c55293d4dee';
export const OCLC_CREATE_INSTANCE_ACTION_ID = 'd0ebba8a-2f0f-11eb-adc1-0242ac120002';
export const OCLC_UPDATE_INSTANCE_ACTION_ID = 'cddff0e1-233c-47ba-8be5-553c632709d9';
export const OCLC_CREATE_MARC_BIB_ACTION_ID = '6aa8e98b-0d9f-41dd-b26f-15658d07eb52';
export const OCLC_CREATE_INSTANCE_MAPPING_ID = 'd0ebbc2e-2f0f-11eb-adc1-0242ac120002';
export const OCLC_UPDATE_INSTANCE_MAPPING_ID = '862000b9-84ea-4cae-a223-5fc0552f2b42';
export const OCLC_CREATE_MARC_BIB_MAPPING_ID = 'f90864ef-8030-480f-a43f-8cdd21233252';
export const QUICKMARK_DERIVE_CREATE_JOB_ID = '6409dcff-71fa-433a-bc6a-e70ad38a9604';
export const QUICKMARK_DERIVE_CREATE_ACTION_ID = 'f8e58651-f651-485d-aead-d2fa8700e2d1';
export const QUICKMARK_DERIVE_CREATE_MAPPING_ID = '991c0300-44a6-47e3-8ea2-b01bb56a38cc';

export const DEFAULT_PROFILE_IDS = [
  OCLC_CREATE_INSTANCE_JOB_ID,
  OCLC_UPDATE_INSTANCE_JOB_ID,
  OCLC_MATCH_EXISTING_SRS_RECORD_ID,
  OCLC_MATCH_NO_SRS_RECORD_ID,
  OCLC_CREATE_INSTANCE_ACTION_ID,
  OCLC_UPDATE_INSTANCE_ACTION_ID,
  OCLC_CREATE_MARC_BIB_ACTION_ID,
  OCLC_CREATE_INSTANCE_MAPPING_ID,
  OCLC_UPDATE_INSTANCE_MAPPING_ID,
  OCLC_CREATE_MARC_BIB_MAPPING_ID,
  QUICKMARK_DERIVE_CREATE_JOB_ID,
  QUICKMARK_DERIVE_CREATE_ACTION_ID,
  QUICKMARK_DERIVE_CREATE_MAPPING_ID,
];

export const RECORD_ACTION_STATUS = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  MULTIPLE: 'MULTIPLE',
  DISCARDED: 'DISCARDED',
};

export const RECORD_ACTION_STATUS_LABEL_IDS = {
  [RECORD_ACTION_STATUS.CREATED]: 'ui-data-import.logLight.actionStatus.created',
  [RECORD_ACTION_STATUS.UPDATED]: 'ui-data-import.logLight.actionStatus.updated',
  [RECORD_ACTION_STATUS.MULTIPLE]: 'ui-data-import.logLight.actionStatus.multiple',
  [RECORD_ACTION_STATUS.DISCARDED]: 'ui-data-import.logLight.actionStatus.discarded',
};
