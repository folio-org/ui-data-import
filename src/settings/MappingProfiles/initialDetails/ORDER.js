const ORDER = {
  name: 'order',
  recordType: 'ORDER',
  mappingFields: [{
    name: 'workflowStatus',
    enabled: true,
    path: 'order.po.workflowStatus',
    value: '',
  }, {
    name: 'approved',
    enabled: true,
    path: 'order.po.approved',
    value: null,
    booleanFieldAction: 'ALL_FALSE',
  }, {
    name: 'poLinesLimit',
    enabled: false,
    path: 'order.po.poLinesLimit', // ?
    value: '"1"',
  }, {
    name: 'overridePoLinesLimit',
    enabled: true,
    path: 'order.po.overridePoLinesLimit', // ?
    value: '',
  }, {
    name: 'prefix',
    enabled: true,
    path: 'order.po.poNumberPrefix',
    value: '',
  }, {
    name: 'poNumber',
    enabled: true,
    path: 'order.po.poNumber',
    value: '',
  }, {
    name: 'suffix',
    enabled: true,
    path: 'order.po.poNumberSuffix',
    value: '',
  }, {
    name: 'vendor',
    enabled: true,
    path: 'order.po.vendor',
    value: '',
  }, {
    name: 'orderType',
    enabled: true,
    path: 'order.po.orderType',
    value: '"One-Time"',
  }, {
    name: 'acqUnitIds',
    enabled: true,
    path: 'order.po.acqUnitIds[]',
    value: '',
    acceptedValues: {},
  }, {
    name: 'assignedTo',
    enabled: true,
    path: 'order.po.assignedTo',
    value: '',
  }, {
    name: 'billTo',
    enabled: true,
    path: 'order.po.billTo',
    value: '',
    acceptedValues: {},
  }, {
    name: 'shipTo',
    enabled: true,
    path: 'order.po.shipTo',
    value: '',
    acceptedValues: {},
  }, {
    name: 'manualPo',
    enabled: true,
    path: 'order.po.manualPo',
    value: null,
    booleanFieldAction: 'ALL_FALSE',
  }, {
    name: 'reEncumber',
    enabled: true,
    path: 'order.po.reEncumber',
    value: '',
    acceptedValues: {},
  }, {
    name: 'notes',
    enabled: true,
    path: 'order.po.notes[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.po.notes[]',
      fields: [{
        name: 'notes',
        enabled: true,
        path: 'order.po.notes[]',
        value: '',
      }],
    }],
  }, {
    name: 'title',
    enabled: true,
    path: 'order.poLine.titleOrPackage',
    value: '',
  }, {
    name: 'receivingNote',
    enabled: true,
    path: 'order.poLine.details.receivingNote',
    value: '',
  }, {
    name: 'isAcknowledged',
    enabled: true,
    path: 'order.poLine.details.isAcknowledged',
    value: '',
    acceptedValues: {},
  }, {
    name: 'subscriptionFrom',
    enabled: true,
    path: 'order.poLine.details.subscriptionFrom',
    value: '',
  }, {
    name: 'subscriptionTo',
    enabled: true,
    path: 'order.poLine.details.subscriptionTo',
    value: '',
  }, {
    name: 'subscriptionInterval',
    enabled: true,
    path: 'order.poLine.details.subscriptionInterval',
    value: '',
  }, {
    name: 'publicationDate',
    enabled: true,
    path: 'order.poLine.publicationDate',
    value: '',
  }, {
    name: 'publisher',
    enabled: true,
    path: 'order.poLine.publisher',
    value: '',
  }, {
    name: 'edition',
    enabled: true,
    path: 'order.poLine.edition',
    value: '',
  }, {
    name: 'contributors',
    enabled: true,
    path: 'order.poLine.contributors[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.poLine.contributors[]',
      fields: [{
        name: 'contributor',
        enabled: true,
        path: 'order.poLine.contributors[].contributor',
        value: '',
      }, {
        name: 'contributorNameTypeId',
        enabled: true,
        path: 'order.poLine.contributors[].contributorNameTypeId',
        value: '',
        acceptedValues: {},
      }],
    }],
  }, {
    name: 'productIds',
    enabled: true,
    path: 'order.poLine.details.productIds[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.poLine.details.productIds[]',
      fields: [{
        name: 'productId',
        enabled: true,
        required: true,
        path: 'order.poLine.details.productIds[].productId',
        value: '',
      }, {
        name: 'qualifier',
        enabled: true,
        path: 'order.poLine.details.productIds[].qualifier',
        value: '',
      }, {
        name: 'productIdType',
        enabled: true,
        path: 'order.poLine.details.productIds[].productIdType',
        value: '',
      }],
    }],
  }, {
    name: 'description',
    enabled: true,
    path: 'order.poLine.description',
    value: '',
  }, {
    name: 'poLineNumber',
    enabled: false,
    path: 'order.poLine.poLineNumber',
    value: '',
  }, {
    name: 'acquisitionMethod',
    enabled: true,
    path: 'order.poLine.acquisitionMethod',
    value: '',
    acceptedValues: {},
  }, {
    name: 'automaticExport',
    enabled: true,
    path: 'order.poLine.automaticExport',
    value: null,
    booleanFieldAction: 'ALL_FALSE',
  }, {
    name: 'orderFormat',
    enabled: true,
    path: 'order.poLine.orderFormat',
    value: '',
    acceptedValues: {},
  }, {
    name: 'receiptDate',
    enabled: true,
    path: 'order.poLine.receiptDate',
    value: '',
  }, {
    name: 'receiptStatus',
    enabled: true,
    path: 'order.poLine.receiptStatus',
    value: '',
  }, {
    name: 'paymentStatus',
    enabled: true,
    path: 'order.poLine.paymentStatus',
    value: '',
    acceptedValues: {},
  }, {
    name: 'source',
    enabled: false,
    path: 'order.poLine.source',
    value: '"MARC"',
  }, {
    name: 'donor',
    enabled: true,
    path: 'order.poLine.donor',
    value: '',
  }, {
    name: 'selector',
    enabled: true,
    path: 'order.poLine.selector',
    value: '',
  }, {
    name: 'requester',
    enabled: true,
    path: 'order.poLine.requester',
    value: '',
  }, {
    name: 'cancellationRestriction',
    enabled: true,
    path: 'order.poLine.cancellationRestriction',
    value: '',
    acceptedValues: {},
  }, {
    name: 'rush',
    enabled: true,
    path: 'order.poLine.rush',
    value: '',
    acceptedValues: {},
  }, {
    name: 'checkinItems',
    enabled: true,
    path: 'order.poLine.checkinItems',
    value: '',
    acceptedValues: {},
  }, {
    name: 'cancellationRestrictionNote',
    enabled: true,
    path: 'order.poLine.cancellationRestrictionNote',
    value: '',
  }, {
    name: 'poLineDescription',
    enabled: true,
    path: 'order.poLine.poLineDescription',
    value: '',
  }, {
    name: 'donorOrganizationIds',
    enabled: true,
    path: 'order.poLine.donorOrganizationIds[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.poLine.donorOrganizationIds[]',
      fields: [{
        name: 'donorOrganizationIds',
        enabled: true,
        path: 'order.poLine.donorOrganizationIds[]',
        value: '',
      }],
    }],
  }, {
    name: 'vendorDetail',
    enabled: true,
    path: 'order.poLine.vendorDetail.referenceNumbers[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.poLine.vendorDetail.referenceNumbers[]',
      fields: [{
        name: 'refNumber',
        enabled: true,
        path: 'order.poLine.vendorDetail.referenceNumbers[].refNumber',
        value: '',
      }, {
        name: 'refNumberType',
        enabled: true,
        path: 'order.poLine.vendorDetail.referenceNumbers[].refNumberType',
        value: '',
      }],
    }],
  }, {
    name: 'vendorAccount',
    enabled: true,
    path: 'order.poLine.vendorDetail.vendorAccount',
    value: '',
    acceptedValues: {},
  }, {
    name: 'instructions',
    enabled: true,
    path: 'order.poLine.vendorDetail.instructions',
    value: '',
    acceptedValues: {},
  }, {
    name: 'listUnitPrice',
    enabled: true,
    path: 'order.poLine.cost.listUnitPrice',
    value: '',
  }, {
    name: 'quantityPhysical',
    enabled: true,
    path: 'order.poLine.cost.quantityPhysical',
    value: '',
  }, {
    name: 'additionalCost',
    enabled: true,
    path: 'order.poLine.cost.additionalCost',
    value: '',
  }, {
    name: 'currency',
    enabled: true,
    path: 'order.poLine.cost.currency',
    value: '',
  }, {
    name: 'exchangeRate',
    enabled: true,
    path: 'order.poLine.cost.exchangeRate',
    value: '',
  }, {
    name: 'electronicUnitPrice',
    enabled: true,
    path: 'order.poLine.cost.listUnitPriceElectronic',
    value: '',
  }, {
    name: 'quantityElectronic',
    enabled: true,
    path: 'order.poLine.cost.quantityElectronic',
    value: '',
  }, {
    name: 'discount',
    enabled: true,
    path: 'order.poLine.cost.discount',
    value: '',
  }, {
    name: 'discountType',
    enabled: true,
    path: 'order.poLine.cost.discountType',
    value: 'percentage',
  }, {
    name: 'fundDistribution',
    enabled: true,
    path: 'order.poLine.fundDistribution[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.poLine.fundDistribution[]',
      fields: [{
        name: 'fundId',
        enabled: true,
        path: 'order.poLine.fundDistribution[].fundId',
        value: '',
        acceptedValues: {},
      }, {
        name: 'expenseClassId',
        enabled: true,
        path: 'order.poLine.fundDistribution[].expenseClassId',
        value: '',
        acceptedValues: {},
      }, {
        name: 'value',
        enabled: true,
        path: 'order.poLine.fundDistribution[].value',
        value: '',
      }, {
        name: 'distributionType',
        enabled: true,
        path: 'order.poLine.fundDistribution[].distributionType',
        value: 'percentage',
      }],
    }],
  }, {
    name: 'locations',
    enabled: true,
    path: 'order.poLine.locations[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.poLine.locations[]',
      fields: [{
        name: 'locationId',
        enabled: true,
        path: 'order.poLine.locations[].locationId',
        value: '',
        acceptedValues: {},
      }, {
        name: 'quantityPhysical',
        enabled: true,
        path: 'order.poLine.locations[].quantityPhysical',
        value: '',
        acceptedValues: {},
      }, {
        name: 'quantityElectronic',
        enabled: true,
        path: 'order.poLine.locations[].quantityElectronic',
        value: '',
      }],
    }],
  }, {
    name: 'materialSupplier',
    enabled: true,
    path: 'order.poLine.physical.materialSupplier',
    value: '',
    acceptedValues: {},
  }, {
    name: 'receiptDue',
    enabled: true,
    path: 'order.poLine.physical.receiptDue',
    value: '',
  }, {
    name: 'expectedReceiptDate',
    enabled: true,
    path: 'order.poLine.physical.expectedReceiptDate',
    value: '',
  }, {
    name: 'createInventory',
    enabled: true,
    path: 'order.poLine.physical.createInventory',
    value: '',
    acceptedValues: {},
  }, {
    name: 'materialType',
    enabled: true,
    path: 'order.poLine.physical.materialType',
    value: '',
  }, {
    name: 'volumes',
    enabled: true,
    path: 'order.poLine.physical.volumes[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'order.poLine.physical.volumes[]',
      fields: [{
        name: 'volumes',
        enabled: true,
        path: 'order.poLine.physical.volumes[]',
        value: '',
      }],
    }],
  }, {
    name: 'accessProvider',
    enabled: true,
    path: 'order.poLine.eresource.accessProvider',
    value: '',
    acceptedValues: {},
  }, {
    name: 'activationStatus',
    enabled: true,
    path: 'order.poLine.eresource.activated',
    value: null,
    booleanFieldAction: 'ALL_FALSE',
  }, {
    name: 'activationDue',
    enabled: true,
    path: 'order.poLine.eresource.activationDue',
    value: '',
  }, {
    name: 'createInventory',
    enabled: true,
    path: 'order.poLine.eresource.createInventory',
    value: '',
    acceptedValues: {},
  }, {
    name: 'materialType',
    enabled: true,
    path: 'order.poLine.eresource.materialType',
    value: '',
    acceptedValues: {},
  }, {
    name: 'trial',
    enabled: true,
    path: 'order.poLine.eresource.trial',
    value: null,
    booleanFieldAction: 'ALL_FALSE',
  }, {
    name: 'expectedActivation',
    enabled: true,
    path: 'order.poLine.eresource.expectedActivation',
    value: '',
  }, {
    name: 'userLimit',
    enabled: true,
    path: 'order.poLine.eresource.userLimit',
    value: '',
  }, {
    name: 'resourceUrl',
    enabled: true,
    path: 'order.poLine.eresource.resourceUrl',
    value: '',
  }],
};

export default ORDER;
