const MARC_BIBLIOGRAPHIC = {
  name: 'marcBib',
  recordType: 'MARC_BIBLIOGRAPHIC',
  /* mapActions: {
    fieldTypeBool: ['ALL_TRUE', 'ALL_FALSE', 'AS_IS', 'IGNORE'],
    fieldTypeRepeateble: ['EXTEND_EXISTING', 'DELETE_EXISTING', 'EXCHANGE_EXISTING', 'DELETE_INCOMING'],
  }, */
  mappingFields: [{
    name: 'discoverySuppress',
    enabled: true,
    path: 'marcBib.discoverySuppress',
    value: null,
    booleanFieldAction: 'AS_IS',
    subfields: [],
  }, {
    name: 'hrid',
    enabled: true,
    path: 'marcBib.hrid',
    value: '',
    subfields: [],
  }],
};

export default MARC_BIBLIOGRAPHIC;
