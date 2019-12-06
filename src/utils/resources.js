export const BASE_INVENTORY_RESOURCE = {
  type: 'okapi',
  headers: { 'X-Okapi-Module-Id': 'mod-inventory-storage-18.2.0-SNAPSHOT.367' },
  path: '_/jsonSchemas',
  records: 'properties',
  throwErrors: false,
};

export const BASE_ORDER_RESOURCE = {
  type: 'okapi',
  headers: { 'X-Okapi-Module-Id': 'mod-orders-9.1.0-SNAPSHOT.237' },
  path: '_/jsonSchemas',
  records: 'properties',
  throwErrors: false,
};

export const BASE_INVOICE_RESOURCE = {
  type: 'okapi',
  headers: { 'X-Okapi-Module-Id': 'mod-invoice-storage-3.1.0-SNAPSHOT.47' },
  path: '_/jsonSchemas',
  records: 'properties',
  throwErrors: false,
};

export const INSTANCE_SCHEMA = {
  INSTANCE: {
    ...BASE_INVENTORY_RESOURCE,
    GET: {
      params: { path: 'mod-inventory-storage/ramls/instance.json' },
      staticFallback: { params: {} },
    },
  },
  INSTANCE_RELATIONSHIP: {
    ...BASE_INVENTORY_RESOURCE,
    GET: {
      params: { path: 'mod-inventory-storage/ramls/instancerelationship.json' },
      staticFallback: { params: {} },
    },
  },
};

export const HOLDINGS_SCHEMA = {
  HOLDINGS: {
    ...BASE_INVENTORY_RESOURCE,
    GET: {
      params: { path: 'mod-inventory-storage/ramls/holdingsrecord.json' },
      staticFallback: { params: {} },
    },
  },
};

export const ITEM_SCHEMA = {
  ITEM: {
    ...BASE_INVENTORY_RESOURCE,
    GET: {
      params: { path: 'mod-inventory-storage/ramls/item.json' },
      staticFallback: { params: {} },
    },
  },
};

export const ORDER_SCHEMA = {
  PURCHASE_ORDER: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/purchase_order.json' },
      staticFallback: { params: {} },
    },
  },
  RENEWAL: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/renewal.json' },
      staticFallback: { params: {} },
    },
  },
  PO_LINE: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/po_line.json' },
      staticFallback: { params: {} },
    },
  },
  DETAILS: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/details.json' },
      staticFallback: { params: {} },
    },
  },
  CONTRIBUTOR: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/contributor.json' },
      staticFallback: { params: {} },
    },
  },
  RECEIVING_HISTORY: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/receiving_history.json' },
      staticFallback: { params: {} },
    },
  },
  COST_DETAILS: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/cost.json' },
      staticFallback: { params: {} },
    },
  },
  FUND_DISTRIBUTION: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/fund_distribution.json' },
      staticFallback: { params: {} },
    },
  },
  LOCATION: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/location.json' },
      staticFallback: { params: {} },
    },
  },
  PHYSICAL: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/physical.json' },
      staticFallback: { params: {} },
    },
  },
  E_RESOURCE: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/eresource.json' },
      staticFallback: { params: {} },
    },
  },
  VENDOR: {
    ...BASE_ORDER_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-orders-storage/schemas/vendor_detail.json' },
      staticFallback: { params: {} },
    },
  },
};

export const INVOICE_SCHEMA = {
  INVOICE: {
    ...BASE_INVOICE_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-invoice-storage/schemas/invoice.json' },
      staticFallback: { params: {} },
    },
  },
  ADJUSTMENTS: {
    ...BASE_INVOICE_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-invoice-storage/schemas/adjustment.json' },
      staticFallback: { params: {} },
    },
  },
  DOCUMENT_METADATA: {
    ...BASE_INVOICE_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-invoice-storage/schemas/document_metadata.json' },
      staticFallback: { params: {} },
    },
  },
  INVOICE_LINE: {
    ...BASE_INVOICE_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-invoice-storage/schemas/invoice_line.json' },
      staticFallback: { params: {} },
    },
  },
  FUND_DISTRIBUTION: {
    ...BASE_INVOICE_RESOURCE,
    GET: {
      params: { path: 'acq-models/mod-invoice-storage/schemas/fund_distribution.json' },
      staticFallback: { params: {} },
    },
  },
};
