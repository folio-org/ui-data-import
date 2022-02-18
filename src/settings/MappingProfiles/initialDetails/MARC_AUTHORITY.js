const MARC_AUTHORITY = {
  name: 'marcAuthority',
  recordType: 'MARC_AUTHORITY',
  marcMappingOption: 'UPDATE',
  mappingFields: [{
    name: 'discoverySuppress',
    enabled: true,
    path: 'marcAuthority.discoverySuppress',
    value: null,
    booleanFieldAction: 'IGNORE',
    subfields: [],
  }, {
    name: 'hrid',
    enabled: true,
    path: 'marcAuthority.hrid',
    value: '',
    subfields: [],
  }],
};

export default MARC_AUTHORITY;
