const MARC_HOLDINGS = {
  name: 'marcHoldings',
  recordType: 'MARC_HOLDINGS',
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
