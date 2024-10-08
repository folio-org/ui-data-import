const INVOICE = {
  name: 'invoice',
  recordType: 'INVOICE',
  mappingFields: [{
    name: 'invoiceDate',
    enabled: true,
    path: 'invoice.invoiceDate',
    value: '',
  }, {
    name: 'status',
    enabled: true,
    path: 'invoice.status',
    value: '"Open"',
  }, {
    name: 'paymentDue',
    enabled: true,
    path: 'invoice.paymentDue',
    value: '',
  }, {
    name: 'paymentTerms',
    enabled: true,
    path: 'invoice.paymentTerms',
    value: '',
  }, {
    name: 'approvalDate',
    enabled: false,
    path: 'invoice.approvalDate',
    value: '',
  }, {
    name: 'approvedBy',
    enabled: false,
    path: 'invoice.approvedBy',
    value: '',
  }, {
    name: 'acqUnitIds',
    enabled: true,
    path: 'invoice.acqUnitIds[]',
    repeatableFieldAction: 'EXTEND_EXISTING',
    value: '',
    subfields: [{
      order: 0,
      path: 'invoice.acqUnitIds[]',
      fields: [{
        name: 'acqUnitIds',
        enabled: true,
        path: 'invoice.acqUnitIds[]',
        value: '',
      }],
    }],
    acceptedValues: {},
  }, {
    name: 'billTo',
    enabled: true,
    path: 'invoice.billTo',
    value: '',
    acceptedValues: {},
  }, {
    name: 'billToAddress',
    enabled: false,
    path: 'invoice.billToAddress',
    value: '',
  }, {
    name: 'batchGroupId',
    enabled: true,
    path: 'invoice.batchGroupId',
    value: '',
    acceptedValues: {},
  }, {
    name: 'subTotal',
    enabled: false,
    path: 'invoice.subTotal',
    value: '',
  }, {
    name: 'adjustmentsTotal',
    enabled: false,
    path: 'invoice.adjustmentsTotal',
    value: '',
  }, {
    name: 'total',
    enabled: false,
    path: 'invoice.total',
    value: '',
  }, {
    name: 'lockTotal',
    enabled: true,
    path: 'invoice.lockTotal',
    value: '',
  }, {
    name: 'note',
    enabled: true,
    path: 'invoice.note',
    value: '',
  }, {
    name: 'adjustments',
    enabled: true,
    path: 'invoice.adjustments[]',
    repeatableFieldAction: null,
    value: '',
    subfields: [{
      order: 0,
      path: 'invoice.adjustments[]',
      fields: [{
        name: 'description',
        enabled: true,
        path: 'invoice.adjustments[].description',
        value: '',
      }, {
        name: 'value',
        enabled: true,
        path: 'invoice.adjustments[].value',
        value: '',
      }, {
        name: 'type',
        enabled: true,
        path: 'invoice.adjustments[].type',
        value: '"Amount"',
      }, {
        name: 'prorate',
        enabled: true,
        path: 'invoice.adjustments[].prorate',
        value: '',
      }, {
        name: 'relationToTotal',
        enabled: true,
        path: 'invoice.adjustments[].relationToTotal',
        value: '',
      }, {
        name: 'exportToAccounting',
        enabled: true,
        path: 'invoice.adjustments[].exportToAccounting',
        value: null,
        booleanFieldAction: 'ALL_FALSE',
      }, {
        name: 'fundDistributions',
        enabled: true,
        path: 'invoice.adjustments[].fundDistributions[]',
        repeatableFieldAction: null,
        value: '',
        subfields: [{
          order: 0,
          path: 'invoice.adjustments[].fundDistributions[]',
          fields: [{
            name: 'fundId',
            enabled: true,
            path: 'invoice.adjustments[].fundDistributions[].fundId',
            value: '',
            acceptedValues: {},
          }, {
            name: 'expenseClassId',
            enabled: true,
            path: 'invoice.adjustments[].fundDistributions[].expenseClassId',
            value: '',
            acceptedValues: {},
          }, {
            name: 'value',
            enabled: true,
            path: 'invoice.adjustments[].fundDistributions[].value',
            value: '',
          }, {
            name: 'distributionType',
            enabled: true,
            path: 'invoice.adjustments[].fundDistributions[].distributionType',
            value: '"percentage"',
          }, {
            name: 'amount',
            enabled: false,
            path: 'invoice.adjustments[].fundDistributions[].amount',
            value: '',
          }],
        }],
      }],
    }],
  }, {
    name: 'vendorInvoiceNo',
    enabled: true,
    path: 'invoice.vendorInvoiceNo',
    value: '',
  }, {
    name: 'vendorId',
    enabled: true,
    path: 'invoice.vendorId',
    value: '',
  }, {
    name: 'accountingCode',
    enabled: false,
    path: 'invoice.accountingCode',
    value: '',
  }, {
    name: 'accountNo',
    enabled: false,
    path: 'invoice.accountNo',
    value: '',
  }, {
    name: 'folioInvoiceNo',
    enabled: false,
    path: 'invoice.folioInvoiceNo',
    value: '',
  }, {
    name: 'paymentMethod',
    enabled: true,
    path: 'invoice.paymentMethod',
    value: '',
  }, {
    name: 'chkSubscriptionOverlap',
    enabled: true,
    path: 'invoice.chkSubscriptionOverlap',
    value: null,
    booleanFieldAction: 'ALL_FALSE',
  }, {
    name: 'exportToAccounting',
    enabled: true,
    path: 'invoice.exportToAccounting',
    value: null,
    booleanFieldAction: 'ALL_FALSE',
  }, {
    name: 'currency',
    enabled: true,
    path: 'invoice.currency',
    value: '',
  }, {
    name: 'currentExchangeRate',
    enabled: false,
    path: 'invoice.currentExchangeRate',
    value: '',
  }, {
    name: 'exchangeRate',
    enabled: true,
    path: 'invoice.exchangeRate',
    value: '',
  }, {
    name: 'invoiceLines',
    enabled: true,
    path: 'invoice.invoiceLines[]',
    repeatableFieldAction: 'EXTEND_EXISTING',
    value: '',
    subfields: [{
      order: 0,
      path: 'invoice.invoiceLines[]',
      fields: [{
        name: 'description',
        enabled: true,
        path: 'invoice.invoiceLines[].description',
        value: '',
      }, {
        name: 'poLineId',
        enabled: true,
        path: 'invoice.invoiceLines[].poLineId',
        value: '',
      }, {
        name: 'invoiceLineNumber',
        enabled: false,
        path: 'invoice.invoiceLines[].invoiceLineNumber',
        value: '',
      }, {
        name: 'invoiceLineStatus',
        enabled: false,
        path: 'invoice.invoiceLines[].invoiceLineStatus',
        value: '',
      }, {
        name: 'referenceNumbers',
        enabled: true,
        path: 'invoice.invoiceLines[].referenceNumbers[]',
        repeatableFieldAction: null,
        value: '',
        subfields: [{
          order: 0,
          path: 'invoice.invoiceLines[].referenceNumbers[]',
          fields: [{
            name: 'refNumber',
            enabled: true,
            path: 'invoice.invoiceLines[].referenceNumbers[].refNumber',
            value: '',
          }, {
            name: 'refNumberType',
            enabled: true,
            path: 'invoice.invoiceLines[].referenceNumbers[].refNumberType',
            value: '',
          }],
        }],
      }, {
        name: 'subscriptionInfo',
        enabled: true,
        path: 'invoice.invoiceLines[].subscriptionInfo',
        value: '',
      }, {
        name: 'subscriptionStart',
        enabled: true,
        path: 'invoice.invoiceLines[].subscriptionStart',
        value: '',
      }, {
        name: 'subscriptionEnd',
        enabled: true,
        path: 'invoice.invoiceLines[].subscriptionEnd',
        value: '',
      }, {
        name: 'comment',
        enabled: true,
        path: 'invoice.invoiceLines[].comment',
        value: '',
      }, {
        name: 'lineAccountingCode',
        enabled: false,
        path: 'invoice.invoiceLines[].accountingCode',
        value: '',
      }, {
        name: 'accountNumber',
        enabled: true,
        path: 'invoice.invoiceLines[].accountNumber',
        value: '',
      }, {
        name: 'quantity',
        enabled: true,
        path: 'invoice.invoiceLines[].quantity',
        value: '',
      }, {
        name: 'lineSubTotal',
        enabled: true,
        path: 'invoice.invoiceLines[].subTotal',
        value: '',
      }, {
        name: 'releaseEncumbrance',
        enabled: true,
        path: 'invoice.invoiceLines[].releaseEncumbrance',
        value: null,
        booleanFieldAction: 'ALL_FALSE',
      }, {
        name: 'fundDistributions',
        enabled: true,
        path: 'invoice.invoiceLines[].fundDistributions[]',
        repeatableFieldAction: null,
        value: '',
        subfields: [{
          order: 0,
          path: 'invoice.invoiceLines[].fundDistributions[]',
          fields: [{
            name: 'fundId',
            enabled: true,
            path: 'invoice.invoiceLines[].fundDistributions[].fundId',
            value: '',
            acceptedValues: {},
          }, {
            name: 'expenseClassId',
            enabled: true,
            path: 'invoice.invoiceLines[].fundDistributions[].expenseClassId',
            value: '',
            acceptedValues: {},
          }, {
            name: 'value',
            enabled: true,
            path: 'invoice.invoiceLines[].fundDistributions[].value',
            value: '',
          }, {
            name: 'distributionType',
            enabled: true,
            path: 'invoice.invoiceLines[].fundDistributions[].distributionType',
            value: '"percentage"',
          }, {
            name: 'amount',
            enabled: false,
            path: 'invoice.invoiceLines[].fundDistributions[].amount',
            value: '',
          }],
        }],
      }, {
        name: 'lineAdjustments',
        enabled: true,
        path: 'invoice.invoiceLines[].adjustments[]',
        repeatableFieldAction: null,
        value: '',
        subfields: [{
          order: 0,
          path: 'invoice.invoiceLines[].adjustments[]',
          fields: [{
            name: 'description',
            enabled: true,
            path: 'invoice.invoiceLines[].adjustments[].description',
            value: '',
          }, {
            name: 'value',
            enabled: true,
            path: 'invoice.invoiceLines[].adjustments[].value',
            value: '',
          }, {
            name: 'type',
            enabled: true,
            path: 'invoice.invoiceLines[].adjustments[].type',
            value: '"Amount"',
          }, {
            name: 'relationToTotal',
            enabled: true,
            path: 'invoice.invoiceLines[].adjustments[].relationToTotal',
            value: '',
          }, {
            name: 'exportToAccounting',
            enabled: true,
            path: 'invoice.invoiceLines[].adjustments[].exportToAccounting',
            value: null,
            booleanFieldAction: 'ALL_FALSE',
          }],
        }],
      }],
    }],
  }],
};

export default INVOICE;
