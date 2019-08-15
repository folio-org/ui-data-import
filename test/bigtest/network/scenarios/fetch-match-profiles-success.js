import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';
import { associatedJobProfiles } from '../../mocks';

export default server => {
  server.create('match-profile', {
    name: '001 to Instance HRID',
    description: 'MARC 001 to Instance ID (numerics only)',
    tags: { tagList: ['hrid'] },
    entityType: 'INVENTORY_ITEM',
    existingRecordType: 'INSTANCE',
    incomingRecordType: 'MARC',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'INSTANCE_HRID',
        }],
        qualifier: { comparisonPart: 'NUMERICS_ONLY' },
      },
      existingRecordType: 'INSTANCE',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '001',
        }, {
          label: 'indicator1',
          value: '',
        }, {
          label: 'indicator2',
          value: '',
        }, {
          label: 'recordSubfield',
          value: '',
        }],
        qualifier: { comparisonPart: 'NUMERICS_ONLY' },
      },
      incomingRecordType: 'MARC',
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  });
  server.create('match-profile', {
    name: 'MARC Identifiers',
    description: 'EDIFACT POL',
    tags: { tagList: ['pol'] },
    entityType: 'INVENTORY_ITEM',
    existingRecordType: 'ORDER',
    incomingRecordType: 'EDIFACT',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'PO_LINE_NUMBER',
        }],
      },
      existingRecordType: 'ORDER',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'RFF+LI',
        }],
      },
      incomingRecordType: 'EDIFACT',
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  });
  server.create('match-profile', {
    name: 'Invoice check',
    description: 'To check whether invoice has already been loaded',
    tags: {
      tagList: [
        'invoice',
        'submatch',
      ],
    },
    entityType: 'INVENTORY_ITEM',
    existingRecordType: 'INVOICE',
    incomingRecordType: 'EDIFACT',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'VENDOR_INVOICE_NUMBER',
        }],
      },
      existingRecordType: 'INVOICE',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'BGM+1004',
        }],
      },
      incomingRecordType: 'EDIFACT',
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  });
  server.create('match-profile', {
    name: 'Item Barcode match',
    description: 'Find item record by barcode number',
    tags: {
      tagList: [
        'barcode',
        'item',
      ],
    },
    entityType: 'INVENTORY_ITEM',
    existingRecordType: 'ITEM',
    incomingRecordType: 'MARC',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'ITEM_BARCODE',
        }],
      },
      existingRecordType: 'ITEM',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '945',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'i',
        }],
      },
      incomingRecordType: 'MARC',
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  });
  server.create('match-profile', {
    name: 'KB ID in 935',
    description: 'KB identifier in 935 $a',
    tags: { tagList: ['kb'] },
    entityType: 'MARC_BIB_RECORD',
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
    incomingRecordType: 'MARC',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '035',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
      },
      existingRecordType: 'MARC_BIBLIOGRAPHIC',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '935',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
      },
      incomingRecordType: 'MARC',
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  });
  server.create('match-profile', {
    name: 'MARC 010',
    description: 'LCCN match',
    tags: { tagList: ['lccn'] },
    entityType: 'INVENTORY_ITEM',
    existingRecordType: 'MARC_AUTHORITY',
    incomingRecordType: 'MARC',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '010',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
      },
      existingRecordType: 'MARC_AUTHORITY',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '010',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
      },
      incomingRecordType: 'MARC',
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  });
  server.create('match-profile', {
    name: 'MARC Identifiers',
    description: 'Try to match on ISBN, else create new record',
    tags: { tagList: ['isbn'] },
    entityType: 'INVENTORY_ITEM',
    existingRecordType: 'INSTANCE',
    incomingRecordType: 'MARC',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'ISBN',
        }],
        qualifier: {
          qualifierType: 'BEGINS_WITH',
          qualifierValue: '978',
        },
      },
      existingRecordType: 'INSTANCE',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '020',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
        qualifier: {
          qualifierType: 'BEGINS_WITH',
          qualifierValue: '978',
        },
      },
      incomingRecordType: 'MARC',
      matchCriterion: 'EXISTING_VALUE_BEGINS_WITH_INCOMING_VALUE',
    }],
  });
  server.create('match-profile', {
    name: 'OCLC 035 DDA',
    description: 'OCLC number match',
    tags: { tagList: ['oclc'] },
    entityType: 'INVENTORY_ITEM',
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
    incomingRecordType: 'MARC',
    matchDetails: [{
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '035',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
        qualifier: {
          qualifierType: 'BEGINS_WITH',
          qualifierValue: '(OCoLC)',
          comparisonPart: 'NUMERICS_ONLY',
        },
      },
      existingRecordType: 'MARC_BIBLIOGRAPHIC',
      incomingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '035',
        }, {
          label: 'indicator1',
          value: ' ',
        }, {
          label: 'indicator2',
          value: ' ',
        }, {
          label: 'recordSubfield',
          value: 'a',
        }],
        qualifier: {
          qualifierType: 'BEGINS_WITH',
          qualifierValue: '(OCoLC)',
          comparisonPart: 'NUMERICS_ONLY',
        },
      },
      incomingRecordType: 'MARC',
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  });

  server.get('/data-import-profiles/matchProfiles', (schema, request) => {
    const { query = '' } = request.queryParams;
    const matchProfiles = schema.matchProfiles.all();

    const searchPattern = /name="(\w+)/;

    return searchEntityByQuery({
      query,
      entity: matchProfiles,
      searchPattern,
      fieldsToMatch: [
        'name',
        'existingRecordType',
        'field',
        'fieldMarc',
        'fieldNonMarc',
        'existingStaticValueType',
        'tags.tagList',
      ],
    });
  });

  server.get('/data-import-profiles/matchProfiles/:id');

  server.delete('/data-import-profiles/matchProfiles/:id', {}, 409);

  server.get('/data-import-profiles/profileAssociations/:id/masters', associatedJobProfiles);
  server.post('/data-import-profiles/matchProfiles', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('match-profile', params);

    return record.attrs;
  });
  server.put('/data-import-profiles/matchProfiles/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const matchProfileModel = schema.matchProfiles.find(id);
    const updatedMatchProfile = JSON.parse(requestBody);

    matchProfileModel.update({ ...updatedMatchProfile });

    return matchProfileModel.attrs;
  });

  server.get('/data-import-profiles/jobProfiles/:id', associatedJobProfiles.childSnapshotWrappers[0].content);
};
