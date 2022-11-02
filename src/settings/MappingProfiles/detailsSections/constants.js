import {
  FIND_ALL_CQL,
  PER_REQUEST_LIMIT,
} from '../../../utils';

export const TRANSLATION_ID_PREFIX = 'ui-data-import.settings.mappingProfiles.map';
export const FIELD_NAME_PREFIX = 'profile.mappingDetails.mappingFields';

export const WRAPPER_SOURCE_LINKS = {
  PREFIXES: `/orders/configuration/prefixes?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  SUFFIXES: `/orders/configuration/suffixes?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  ACQUISITIONS_UNITS: `/acquisitions-units/units?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  ADDRESSES: `/configurations/entries?limit=${PER_REQUEST_LIMIT}&query=(module=TENANT and configName=tenant.addresses) sortBy value`,
  CONTRIBUTOR_TYPES: `/contributor-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  IDENTIFIER_TYPES: `/identifier-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  ACQUISITION_METHODS: `/orders/acquisition-methods?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby value`,
  FUNDS: `/finance/funds?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  EXPENSE_CLASSES: `/finance/expense-classes?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  LOCATIONS: `/locations?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  MATERIAL_TYPES: `/material-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  BATCH_GROUPS: `/batch-groups?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  HOLDING_TYPES: `/holdings-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  STATISTICAL_CODES: `/statistical-codes?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  STATISTICAL_CODE_TYPES: `/statistical-code-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  ELECTRONIC_ACCESS: `/electronic-access-relationships?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  ILL_POLICIES: `/ill-policies?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  HOLDINGS_NOTE_TYPES: `/holdings-note-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  CALL_NUMBER_TYPES: `/call-number-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  INSTANCE_STATUSES: `/instance-statuses?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  NATURE_OF_CONTENT_TERMS: `/nature-of-content-terms?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  INSTANCE_RELATIONSHIP_TYPES: `/instance-relationship-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  ITEM_DAMAGE_STATUS: `/item-damaged-statuses?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  ITEM_NOTE_TYPES: `/item-note-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
  LOAN_TYPES: `/loan-types?limit=${PER_REQUEST_LIMIT}&query=${FIND_ALL_CQL} sortby name`,
};
