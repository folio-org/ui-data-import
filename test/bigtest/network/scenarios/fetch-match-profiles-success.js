import { SYSTEM_USER_NAME } from '../../../../src/utils/constants';

export default server => {
  server.create('match-profile', {
    id: 'cdf0ca3a-b515-4abd-82b6-48ce65374963',
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
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-10-30T12:41:22.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-11-02T12:09:51.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });
  server.create('match-profile', {
    id: 'a3510db6-5b3a-48ed-96c0-99a03df87b79',
    name: 'MARC Identifiers',
    description: 'Try to match on ISBN, else create new record',
    tags: {
      tagList: ['isbn'],
    },
    existingRecordType: 'INSTANCE',
    incomingDataValueType: 'VALUE_FROM_INCOMING_RECORD',
    field: '020',
    incomingStaticValueType: '',
    fieldMarc: '',
    fieldNonMarc: 'ISBN',
    existingStaticValueType: '',
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-10-30T12:42:18.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-11-03T10:01:30.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });
  server.create('match-profile', {
    id: 'ab32efdb-43c2-4cb5-b7dc-49dd45c02106',
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
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-10-30T12:45:33.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-11-03T11:22:30.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });
  server.create('match-profile', {
    id: '88bb7c9f-79f2-4a97-b600-535f1d913378',
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
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-11-01T10:12:51.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-12-02T09:05:30.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });
  server.create('match-profile', {
    id: 'ab05c370-7b9d-400f-962b-cb7953b940dd',
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
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-11-01T10:37:53.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-12-03T11:45:21.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });
  server.create('match-profile', {
    id: 'afe7eb12-ea47-4970-8d0e-981b988aed0c',
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
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-11-02T10:20:32.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-12-02T10:45:21.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });
  server.create('match-profile', {
    id: '23cec3f0-092c-4201-9ffc-643f61da03d8',
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
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-11-02T10:18:44.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-12-03T14:20:21.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });
  server.create('match-profile', {
    id: '054a185d-f90b-409d-9203-4cc389e20d13',
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
    userInfo: {
      firstName: 'DIKU',
      lastName: 'ADMINISTRATOR',
      userName: 'diku_admin',
    },
    metadata: {
      createdDate: '2018-11-01T10:09:51.000+0000',
      createdByUserId: '',
      createdByUsername: '',
      updatedDate: '2018-12-01T15:21:28.000+0000',
      updatedByUserId: '',
      updatedByUsername: '',
    },
  });

  server.get('/data-import-profiles/matchProfiles');
};
