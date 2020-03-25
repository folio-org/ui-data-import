const ORDER = {
  name: 'order',
  recordType: 'ORDER',
  /* mapActions: {
    fieldTypeBool: ['ALL_TRUE', 'ALL_FALSE', 'AS_IS', 'IGNORE'],
    fieldTypeRepeateble: ['EXTEND_EXISTING', 'DELETE_EXISTING', 'EXCHANGE_EXISTING', 'DELETE_INCOMING'],
  }, */
  mappingFields: [{
    name: 'discoverySuppress',
    enabled: true,
    path: 'order.discoverySuppress',
    value: null,
    booleanFieldAction: 'AS_IS',
    subfields: [],
  }, {
    name: 'hrid',
    enabled: true,
    path: 'order.hrid',
    value: '',
    subfields: [],
  }],
};

export default ORDER;
