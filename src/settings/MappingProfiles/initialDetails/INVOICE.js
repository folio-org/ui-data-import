const INVOICE = {
  name: 'invoice',
  recordType: 'INVOICE',
  /* mapActions: {
    fieldTypeBool: ['ALL_TRUE', 'ALL_FALSE', 'AS_IS', 'IGNORE'],
    fieldTypeRepeateble: ['EXTEND_EXISTING', 'DELETE_EXISTING', 'EXCHANGE_EXISTING', 'DELETE_INCOMING'],
  }, */
  mappingFields: [{
    name: 'discoverySuppress',
    enabled: true,
    path: 'invoice.discoverySuppress',
    value: null,
    booleanFieldAction: 'AS_IS',
    subfields: [],
  }, {
    name: 'hrid',
    enabled: true,
    path: 'invoice.hrid',
    value: '',
    subfields: [],
  }],
};

export default INVOICE;
