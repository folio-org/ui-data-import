
export default server => {
  server.create('match-profile', {
    name: 'POL-MARC',
    description: 'Use for POL in 990 $p',
    tags: {
      tagList: ['pol'],
    },
    existingRecordType: 'ORDER',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: '990',
    incomingStaticValueType: '',
    fieldMarc: '',
    fieldNonMarc: 'PO_LINE_NUMBER',
    existingStaticValueType: '',
  });
  server.create('match-profile', {
    name: 'MARC Identifiers',
    description: 'Try to match on ISBN, else create new record',
    tags: {
      tagList: [],
    },
    existingRecordType: 'INSTANCE',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: '020',
    incomingStaticValueType: '',
    fieldMarc: '',
    fieldNonMarc: 'ISBN',
    existingStaticValueType: '',
  });
  server.create('match-profile', {
    name: 'KB ID in 935',
    description: 'KB identifier in 935 $a',
    tags: {
      tagList: ['kb'],
    },
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: '935',
    incomingStaticValueType: '',
    fieldMarc: '035',
    fieldNonMarc: '',
    existingStaticValueType: '',
  });
  server.create('match-profile', {
    name: '001 to Instance HRID',
    description: 'MARC 001 to Instance ID (numerics only)',
    tags: {
      tagList: ['hrid'],
    },
    existingRecordType: 'INSTANCE',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: '001',
    incomingStaticValueType: '',
    fieldMarc: '',
    fieldNonMarc: 'INSTANCE_HRID',
    existingStaticValueType: '',
  });
  server.create('match-profile', {
    name: 'Related holdings HRID',
    description: 'Related location code = main',
    tags: {
      tagList: [
        'location',
        'submatch',
      ],
    },
    existingRecordType: 'HOLDINGS',
    incomingDataValueType: 'STATIC_VALUE',
    field: '',
    incomingStaticValueType: 'TEXT',
    fieldMarc: '',
    fieldNonMarc: 'LOCATION_CODE',
    existingStaticValueType: '',
  });
  server.create('match-profile', {
    name: 'MARC 010',
    description: 'LCCN match',
    tags: {
      tagList: ['lccn'],
    },
    existingRecordType: 'MARC_AUTHORITY',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: '010',
    incomingStaticValueType: '',
    fieldMarc: '010',
    fieldNonMarc: '',
    existingStaticValueType: '',
  });
  server.create('match-profile', {
    name: 'OCLC 035 DDA',
    description: 'OCLC number match',
    tags: {
      tagList: ['oclc'],
    },
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: '035',
    incomingStaticValueType: '',
    fieldMarc: '035',
    fieldNonMarc: '',
    existingStaticValueType: '',
  });
  server.create('match-profile', {
    name: 'EDI regular',
    description: 'EDIFACT POL',
    tags: {
      tagList: ['pol'],
    },
    existingRecordType: 'ORDER',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: 'TBD',
    incomingStaticValueType: '',
    fieldMarc: '',
    fieldNonMarc: 'PO_LINE_NUMBER',
    existingStaticValueType: '',
  });

  server.get('/data-import-profiles/matchProfiles');
};
