const MARC_HOLDINGS = {
  name: 'marcHoldings',
  recordType: 'MARC_HOLDINGS',
  /* mapActions: {
    fieldTypeBool: ['ALL_TRUE', 'ALL_FALSE', 'AS_IS', 'IGNORE'],
    fieldTypeRepeateble: ['EXTEND_EXISTING', 'DELETE_EXISTING', 'EXCHANGE_EXISTING', 'DELETE_INCOMING'],
  }, */
  mappingFields: [{
    name: 'discoverySuppress',
    enabled: true,
    path: 'marcHoldings.discoverySuppress',
    value: null,
    booleanFieldAction: 'AS_IS',
    subfields: [],
  }, {
    name: 'hrid',
    enabled: true,
    path: 'marcHoldings.hrid',
    value: '',
    subfields: [],
  }],
};

export default MARC_HOLDINGS;
