import {
  FIND_ALL_CQL,
  PER_REQUEST_LIMIT,
} from '../../../utils';

export const TRANSLATION_ID_PREFIX = 'ui-data-import.settings.mappingProfiles.map';
export const FIELD_NAME_PREFIX = 'profile.mappingDetails.mappingFields';

export const CREATE_INVENTORY_TYPES = {
  INSTANCE_HOLDINGS_ITEM: 'Instance, Holding, Item',
  INSTANCE_HOLDINGS: 'Instance, Holding',
  INSTANCE: 'Instance',
  NONE: 'None',
};
export const ORDER_FORMATS = {
  ELECTRONIC_RESOURCE: 'Electronic Resource',
  PE_MIX: 'P/E Mix',
  PHYSICAL_RESOURCE: 'Physical Resource',
  OTHER: 'Other',
};
export const RECEIPT_STATUS = {
  PENDING: 'Pending',
  NOT_REQUIRED: 'Receipt not required',
};
export const RECEIVING_WORKFLOW = {
  SYNCHRONIZED: 'Synchronized',
  INDEPENDENT: 'Independent',
};
export const VENDOR_REF_TYPES = {
  CONTINUATION_REF_NUMBER: 'Vendor continuation reference number',
  INTERNAL_NUMBER: 'Vendor internal number',
  ORDER_REF_NUMBER: 'Vendor order reference number',
  SUBSCRIPTION_REF_NUMBER: 'Vendor subscription reference number',
  TITLE_NUMBER: 'Vendor title number',
};
export const CONTRIBUTOR_TYPES = {
  PERSONAL_NAME: 'Personal name',
  CORPORATE_NAME: 'Corporate name',
  MEETING_NAME: 'Meeting name',
  INN_REACH_AUTHOR: 'INN-Reach author',
};

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

export const FUND_DISTRIBUTION_VISIBLE_COLUMNS = {
  FUND_ID: 'fundId',
  EXPENSE_CLASS_ID: 'expenseClassId',
  VALUE: 'value',
};

export const LOCATION_VISIBLE_COLUMNS = {
  LOCATION_ID: 'locationId',
  QUANTITY_PHYSICAL: 'quantityPhysical',
  QUANTITY_ELECTRONIC: 'quantityElectronic',
};

export const CONTRIBUTORS_VISIBLE_COLUMNS = {
  CONTRIBUTOR: 'contributor',
  CONTRIBUTOR_TYPE_ID: 'contributorNameTypeId',
};

export const PRODUCT_IDS_VISIBLE_COLUMNS = {
  PRODUCT_ID: 'productId',
  QUALIFIER: 'qualifier',
  PRODUCT_ID_TYPE: 'productIdType',
};

export const NOTES_VISIBLE_COLUMNS = { NOTE: 'note' };

export const PHYSICAL_RESOURCE_VISIBLE_COLUMNS = { VOLUMES: 'volumes' };

export const VENDOR_VISIBLE_COLUMNS = {
  REF_NUMBER: 'refNumber',
  REF_NUMBER_TYPE: 'refNumberType',
};

export const UUID_IN_QUOTES_PATTERN = /^"([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})"$/;
