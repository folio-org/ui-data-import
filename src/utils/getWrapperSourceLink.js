import {
  FIND_ALL_CQL,
  PER_REQUEST_LIMIT,
} from './constants';

export const getWrapperSourceLink = (key, resourceLimit = PER_REQUEST_LIMIT) => {
  const WRAPPER_SOURCE_LINKS = {
    PREFIXES: `/orders/configuration/prefixes?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    SUFFIXES: `/orders/configuration/suffixes?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    ACQUISITIONS_UNITS: `/acquisitions-units/units?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    ADDRESSES: `/settings/entries?limit=${resourceLimit}&query=(scope=tenant and key=tenant.addresses) sortBy value`,
    CONTRIBUTOR_NAME_TYPES: `/contributor-name-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    IDENTIFIER_TYPES: `/identifier-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    ACQUISITION_METHODS: `/orders/acquisition-methods?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby value`,
    FUNDS: `/finance/funds?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    EXPENSE_CLASSES: `/finance/expense-classes?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    LOCATIONS: `/locations?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    MATERIAL_TYPES: `/material-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    BATCH_GROUPS: `/batch-groups?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    HOLDING_TYPES: `/holdings-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    STATISTICAL_CODES: `/statistical-codes?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    STATISTICAL_CODE_TYPES: `/statistical-code-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    ELECTRONIC_ACCESS: `/electronic-access-relationships?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    ILL_POLICIES: `/ill-policies?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    HOLDINGS_NOTE_TYPES: `/holdings-note-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    CALL_NUMBER_TYPES: `/call-number-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    INSTANCE_STATUSES: `/instance-statuses?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    NATURE_OF_CONTENT_TERMS: `/nature-of-content-terms?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    INSTANCE_RELATIONSHIP_TYPES: `/instance-relationship-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    ITEM_DAMAGE_STATUS: `/item-damaged-statuses?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    ITEM_NOTE_TYPES: `/item-note-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
    LOAN_TYPES: `/loan-types?limit=${resourceLimit}&query=${FIND_ALL_CQL} sortby name`,
  };

  return WRAPPER_SOURCE_LINKS[key];
};
