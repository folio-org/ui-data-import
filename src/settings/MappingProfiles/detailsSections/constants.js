export const TRANSLATION_ID_PREFIX = 'ui-data-import.settings.mappingProfiles.map';
export const FIELD_NAME_PREFIX = 'profile.mappingDetails.mappingFields';

export const CREATE_INVENTORY_PHYSICAL_PATH = '';
export const CREATE_INVENTORY_ERESOURCE_PATH = 'order.poLine.eresource.createInventory';

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
export const PO_STATUS = {
  OPEN: 'Open',
  PENDING: 'Pending',
};
export const RECEIPT_STATUS = {
  PENDING: 'Pending',
  NOT_REQUIRED: 'Receipt Not Required',
};
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  NOT_REQUIRED: 'Payment Not Required',
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

export const DONOR_INFORMATION_VISIBLE_COLUMNS = { DONOR: 'donor' };

export const VENDOR_VISIBLE_COLUMNS = {
  REF_NUMBER: 'refNumber',
  REF_NUMBER_TYPE: 'refNumberType',
};

export const ALLOWED_PROD_ID_TYPE_NAMES = [
  'LCCN',
  'ASIN',
  'CODEN',
  'DOI',
  'GPO item number',
  'ISBN',
  'ISMN',
  'ISSN',
  'Publisher or distributor number',
  'Report number',
  'Standard technical report number',
  'UPC',
  'URN',
];

export const UUID_IN_QUOTES_PATTERN = /"([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})"$/;

export const DEFAULT_PO_LINES_LIMIT_VALUE = '1';
