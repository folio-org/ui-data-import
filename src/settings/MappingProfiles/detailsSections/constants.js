import {
  FIND_ALL_CQL,
  PER_REQUEST_LIMIT,
} from '../../../utils';

export const TRANSLATION_ID_PREFIX = 'ui-data-import.settings.mappingProfiles.map';
export const FIELD_NAME_PREFIX = 'profile.mappingDetails.mappingFields';

export const CREATE_INVENTORY_TYPES = {
  INSTANCE_HOLDINGS_ITEM: 'Instance, holdings, item',
  INSTANCE_HOLDINGS: 'Instance, holdings',
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
export const BOOL_OPTIONS = {
  FALSE: 'false',
  TRUE: 'true',
};
export const VENDOR_REF_TYPES = {
  CONTINUATION_REF_NUMBER: 'Vendor continuation reference number',
  INTERNAL_NUMBER: 'Vendor internal number',
  ORDER_REF_NUMBER: 'Vendor order reference number',
  SUBSCRIPTION_REF_NUMBER: 'Vendor subscription reference number',
  TITLE_NUMBER: 'Vendor title number',
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
};
