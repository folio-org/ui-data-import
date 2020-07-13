import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';
import { noAssociatedJobProfiles } from '../../mocks';

export default server => {
  server.create('match-profile', {
    name: '001 to Instance HRID',
    description: 'MARC 001 to Instance ID (numerics only)',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'INSTANCE',
    matchDetails: [
      {
        incomingRecordType: 'MARC_BIBLIOGRAPHIC',
        existingRecordType: 'INSTANCE',
        matchCriterion: 'EXACTLY_MATCHES',
        existingMatchExpression: {
          dataValueType: 'VALUE_FROM_RECORD',
          fields: [{
            label: 'field',
            value: 'instance.hrid',
          }],
          qualifier: { comparisonPart: 'NUMERICS_ONLY' },
        },
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
            label: 'subfield',
            value: 'a',
          }],
          qualifier: { comparisonPart: 'NUMERICS_ONLY' },
        },
      },
    ],
  });
  server.create('match-profile', {
    name: 'EDI regular',
    description: 'EDIFACT POL',
    incomingRecordType: 'EDIFACT_INVOICE',
    existingRecordType: 'ORDER',
    parentProfiles: noAssociatedJobProfiles,
    matchDetails: [{
      incomingRecordType: 'EDIFACT_INVOICE',
      existingRecordType: 'ORDER',
      matchCriterion: 'EXACTLY_MATCHES',
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'po_line.poLineNumber',
        }],
        qualifier: { comparisonPart: 'NUMERICS_ONLY' },
      },
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
          label: 'subfield',
          value: 'a',
        }],
        qualifier: { comparisonPart: 'NUMERICS_ONLY' },
      },
    }],
  });
  server.create('match-profile', {
    name: 'Invoice check',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'INVOICE',
    matchDetails: [{
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'INVOICE',
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'invoice.vendorInvoiceNo',
        }],
      },
    }],
  });
  server.create('match-profile', {
    name: 'Item Barcode match',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'ITEM',
    matchDetails: [{
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'ITEM',
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'item.barcode',
        }],
      },
    }],
  });
  server.create('match-profile', {
    name: 'KB ID in 935',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
    matchDetails: [{
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'MARC_BIBLIOGRAPHIC',
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
          label: 'subfield',
          value: 'a',
        }],
      },
    }],
  });
  server.create('match-profile', {
    name: 'MARC 010',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'MARC_AUTHORITY',
    matchDetails: [{
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'MARC_AUTHORITY',
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
          label: 'subfield',
          value: 'a',
        }],
      },
    }],
  });
  server.create('match-profile', {
    name: 'MARC Identifiers',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'INSTANCE',
    matchDetails: [{
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'INSTANCE',
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: 'instance.identifiers[].value',
        }],
      },
    }],
  });
  server.create('match-profile', {
    name: 'OCLC 035 DDA',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
    matchDetails: [{
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '035',
        }, {
          label: 'indicator1',
          value: '',
        }, {
          label: 'indicator2',
          value: '',
        }, {
          label: 'subfield',
          value: 'a',
        }],
      },
    }],
  });
  server.create('match-profile', {
    name: 'Test static value type text',
    incomingRecordType: 'STATIC_VALUE',
    existingRecordType: 'INSTANCE',
    matchDetails: [{
      incomingRecordType: 'STATIC_VALUE',
      existingRecordType: 'INSTANCE',
      incomingMatchExpression: {
        dataValueType: 'STATIC_VALUE',
        fields: [],
        staticValueDetails: {
          staticValueType: 'TEXT',
          text: 'Test value',
        },
      },
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '',
        }],
      },
    }],
  });
  server.create('match-profile', {
    name: 'Test static value type date',
    incomingRecordType: 'STATIC_VALUE',
    existingRecordType: 'INSTANCE',
    matchDetails: [{
      incomingRecordType: 'STATIC_VALUE',
      existingRecordType: 'INSTANCE',
      incomingMatchExpression: {
        dataValueType: 'STATIC_VALUE',
        fields: [],
        staticValueDetails: {
          staticValueType: 'EXACT_DATE',
          exactDate: '2020-03-19T00:00:00.000Z',
        },
      },
      existingMatchExpression: {
        dataValueType: 'VALUE_FROM_RECORD',
        fields: [{
          label: 'field',
          value: '',
        }],
      },
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
  server.post('/data-import-profiles/matchProfiles', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('match-profile', params.profile);

    return record.attrs;
  });
  server.put('/data-import-profiles/matchProfiles/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const matchProfileModel = schema.matchProfiles.find(id);
    const updatedMatchProfile = JSON.parse(requestBody);

    matchProfileModel.update({ ...updatedMatchProfile.profile });

    return matchProfileModel.attrs;
  });
};
