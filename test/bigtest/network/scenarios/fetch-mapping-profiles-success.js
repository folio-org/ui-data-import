import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';
import { noAssociatedActionProfiles } from '../../mocks';

export default server => {
  server.create('mapping-profile', {
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'INSTANCE',
    mappingDetails: {
      name: 'instance',
      recordType: 'INSTANCE',
      mappingFields: [{
        name: 'statisticalCodeIds',
        enabled: true,
        path: 'instance.statisticalCodeIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.statisticalCodeIds[]',
          fields: [{
            name: 'statisticalCodeId',
            enabled: true,
            path: 'instance.statisticalCodeIds[].statisticalCodeId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'precedingTitles',
        enabled: true,
        path: 'instance.precedingTitles',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.precedingTitles[]',
          fields: [{
            name: 'precedingTitlesTitle',
            enabled: true,
            path: 'instance.precedingTitles[].precedingTitlesTitle',
            value: 'test1',
          }, {
            name: 'precedingTitlesHrid',
            enabled: true,
            path: 'instance.precedingTitles[].precedingTitlesHrid',
            value: 'test1',
          }, {
            name: 'precedingTitlesIsbn',
            enabled: true,
            path: 'instance.precedingTitles[].precedingTitlesIsbn',
            value: 'test1',
          }, {
            name: 'precedingTitlesIssn',
            enabled: true,
            path: 'instance.precedingTitles[].precedingTitlesIssn',
            value: 'test1',
          }],
        }],
      }, {
        name: 'succeedingTitles',
        enabled: true,
        path: 'instance.succeedingTitles',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.succeedingTitles[]',
          fields: [{
            name: 'succeedingTitlesTitle',
            enabled: true,
            path: 'instance.succeedingTitles[].succeedingTitlesTitle',
            value: 'test1',
          }, {
            name: 'succeedingTitlesHrid',
            enabled: true,
            path: 'instance.succeedingTitles[].succeedingTitlesHrid',
            value: 'test1',
          }, {
            name: 'succeedingTitlesIsbn',
            enabled: true,
            path: 'instance.precedingTitles[].succeedingTitlesIsbn',
            value: 'test1',
          }, {
            name: 'succeedingTitlesIssn',
            enabled: true,
            path: 'instance.succeedingTitles[].succeedingTitlesIssn',
            value: 'test1',
          }],
        }],
      }, {
        name: 'alternativeTitles',
        enabled: false,
        path: 'instance.alternativeTitles',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.alternativeTitles[]',
          fields: [{
            order: 0,
            name: 'alternativeTitleTypeId',
            enabled: false,
            path: 'instance.alternativeTitles[].alternativeTitleTypeId',
            value: 'test1',
          }, {
            order: 1,
            name: 'alternativeTitle',
            enabled: false,
            path: 'instance.alternativeTitles[].alternativeTitle',
            value: 'test1',
          }],
        }],
      }, {
        name: 'series',
        enabled: false,
        path: 'instance.series',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.series[]',
          fields: [{
            order: 0,
            name: 'source',
            enabled: false,
            path: 'instance.series[].source',
            value: 'test1',
          }],
        }],
      }, {
        name: 'identifiers',
        enabled: false,
        path: 'instance.identifiers',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.identifiers[]',
          fields: [{
            order: 0,
            name: 'identifierTypeId',
            enabled: false,
            path: 'instance.identifiers[].identifierTypeId',
            value: 'test1',
          }, {
            order: 1,
            name: 'value',
            enabled: false,
            path: 'instance.identifiers[].value',
            value: 'test1',
          }],
        }],
      }, {
        name: 'contributors',
        enabled: false,
        path: 'instance.contributors',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.contributors[]',
          fields: [{
            order: 0,
            name: 'name',
            enabled: false,
            path: 'instance.contributors[].name',
            value: 'test1',
          }, {
            order: 0,
            name: 'contributorNameTypeId',
            enabled: false,
            path: 'instance.contributors[].contributorNameTypeId',
            value: 'test1',
          }, {
            order: 1,
            name: 'contributorTypeId',
            enabled: false,
            path: 'instance.contributors[].contributorTypeId',
            value: 'test1',
          }, {
            order: 2,
            name: 'contributorTypeText',
            enabled: false,
            path: 'instance.contributors[].contributorTypetext',
            value: 'test1',
          }, {
            order: 3,
            name: 'primary',
            enabled: false,
            path: 'instance.contributors[].primary',
            value: 'test1',
            booleanFieldAction: 'AS_IS',
          }],
        }],
      }, {
        name: 'publication',
        enabled: false,
        path: 'instance.publication',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.publication[]',
          fields: [{
            order: 0,
            name: 'publisher',
            enabled: false,
            path: 'instance.publication[].publisher',
            value: 'test1',
          }, {
            order: 1,
            name: 'role',
            enabled: false,
            path: 'instance.publication[].role',
            value: 'test1',
          }, {
            order: 2,
            name: 'place',
            enabled: false,
            path: 'instance.publication[].place',
            value: 'test1',
          }, {
            order: 3,
            name: 'dateOfPublication',
            enabled: false,
            path: 'instance.publication[].dateOfPublication',
            value: 'test1',
          }],
        }],
      }, {
        name: 'editions',
        enabled: false,
        path: 'instance.editions',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.editions[]',
          fields: [{
            order: 0,
            name: 'edition',
            enabled: false,
            path: 'instance.editions[].edition',
            value: 'test1',
          }],
        }],
      }, {
        name: 'physicalDescriptions',
        enabled: false,
        path: 'instance.physicalDescriptions',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.physicalDescriptions[]',
          fields: [{
            order: 0,
            name: 'physicalDescription',
            enabled: false,
            path: 'instance.physicalDescriptions[].physicalDescription',
            value: 'test1',
          }],
        }],
      }, {
        name: 'natureOfContentTermIds',
        enabled: true,
        path: 'instance.natureOfContentTermIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.natureOfContentTermIds[]',
          fields: [{
            order: 0,
            name: 'natureOfContentTermId',
            enabled: true,
            path: 'instance.natureOfContentTermIds[].natureOfContentTermId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'instanceFormatIds',
        enabled: false,
        path: 'instance.instanceFormatIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.instanceFormatIds[]',
          fields: [{
            order: 0,
            name: 'instanceFormatId',
            enabled: false,
            path: 'instance.instanceFormatIds[].instanceFormatId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'languages',
        enabled: false,
        path: 'instance.languages',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.languages[]',
          fields: [{
            order: 0,
            name: 'languageId',
            enabled: false,
            path: 'instance.languages[].languageId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'publicationFrequency',
        enabled: false,
        path: 'instance.publicationFrequency',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.publicationFrequency[]',
          fields: [{
            order: 0,
            name: 'publicationFrequency',
            enabled: false,
            path: 'instance.publicationFrequency[].publicationFrequency',
            value: 'test1',
          }],
        }],
      }, {
        name: 'publicationRange',
        enabled: false,
        path: 'instance.publicationRange',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.publicationRange[]',
          fields: [{
            order: 0,
            name: 'publicationRange',
            enabled: false,
            path: 'instance.publicationRange[].publicationRange',
            value: 'test1',
          }],
        }],
      }, {
        name: 'notes',
        enabled: false,
        path: 'instance.notes',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.notes[]',
          fields: [{
            order: 0,
            name: 'noteType',
            enabled: false,
            path: 'instance.notes[].noteType',
            value: 'test1',
          }, {
            order: 1,
            name: 'note',
            enabled: false,
            path: 'instance.notes[].note',
            value: 'test1',
          }, {
            order: 2,
            name: 'staffOnly',
            enabled: false,
            path: 'instance.notes[].staffOnly',
            value: null,
            booleanFieldAction: 'AS_IS',
          }],
        }],
      }, {
        name: 'electronicAccess',
        enabled: false,
        path: 'instance.electronicAccess',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.electronicAccess[]',
          fields: [{
            order: 0,
            name: 'relationshipId',
            enabled: false,
            path: 'instance.electronicAccess[].relationshipId',
            value: 'test1',
          }, {
            order: 1,
            name: 'uri',
            enabled: false,
            path: 'instance.electronicAccess[].uri',
            value: 'test1',
          }, {
            order: 2,
            name: 'linkText',
            enabled: false,
            path: 'instance.electronicAccess[].linkText',
            value: 'test1',
          }, {
            order: 3,
            name: 'materialsSpecification',
            enabled: false,
            path: 'instance.electronicAccess[].materialsSpecification',
            value: 'test1',
          }, {
            order: 4,
            name: 'publicNote',
            enabled: false,
            path: 'instance.electronicAccess[].publicNote',
            value: 'test1',
          }],
        }],
      }, {
        name: 'subjects',
        enabled: false,
        path: 'instance.subjects',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.subjects[]',
          fields: [{
            order: 0,
            name: 'subject',
            enabled: false,
            path: 'instance.subjects[].subject',
            value: 'test1',
          }],
        }],
      }, {
        name: 'classifications',
        enabled: false,
        path: 'instance.classifications',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.classifications[]',
          fields: [{
            order: 0,
            name: 'classificationTypeId',
            enabled: false,
            path: 'instance.classifications[].classificationTypeId',
            value: 'test1',
          }, {
            order: 1,
            name: 'classificationNumber',
            enabled: false,
            path: 'instance.classifications[].classificationNumber',
            value: 'test1',
          }],
        }],
      }, {
        name: 'parentInstances',
        enabled: true,
        path: 'instance.parentInstances',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.parentInstances[]',
          fields: [{
            order: 0,
            name: 'superInstanceId',
            enabled: true,
            path: 'instance.parentInstances[].superInstanceId',
            value: 'test',
          }, {
            order: 1,
            name: 'instanceRelationshipTypeId',
            enabled: true,
            path: 'instance.parentInstances[].instanceRelationshipTypeId',
            value: 'test',
          }],
        }],
      }, {
        name: 'childInstances',
        enabled: true,
        path: 'instance.childInstances',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.childInstances[]',
          fields: [{
            order: 0,
            name: 'subInstanceId',
            enabled: true,
            path: 'instance.childInstances[].subInstanceId',
            value: 'test1',
          }, {
            order: 1,
            name: 'instanceRelationshipTypeId',
            enabled: true,
            path: 'instance.childInstances[].instanceRelationshipTypeId',
            value: 'test1',
          }],
        }],
      }],
    },
    parentProfiles: noAssociatedActionProfiles,
  });
  server.create('mapping-profile', {
    incomingRecordType: 'MARC_HOLDINGS',
    existingRecordType: 'HOLDINGS',
    mappingDetails: {
      name: 'holdings',
      recordType: 'HOLDINGS',
      mappingFields: [{
        name: 'formerIds',
        enabled: true,
        path: 'holdings.formerIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.formerIds[]',
          fields: [{
            order: 0,
            name: 'formerId',
            enabled: true,
            path: 'holdings.formerIds[].formerId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'statisticalCodeIds',
        enabled: true,
        path: 'holdings.statisticalCodeIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.statisticalCodeIds[]',
          fields: [{
            order: 0,
            name: 'statisticalCodeId',
            enabled: true,
            path: 'holdings.statisticalCodeIds[].statisticalCodeId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'holdingStatements',
        enabled: true,
        path: 'holdings.holdingStatements',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.holdingStatements[]',
          fields: [{
            order: 0,
            name: 'statement',
            enabled: true,
            path: 'holdings.holdingStatements[].statement',
            value: 'test1',
          }, {
            order: 0,
            name: 'note',
            enabled: true,
            path: 'holdings.holdingStatements[].note',
            value: 'test1',
          }],
        }],
      }, {
        name: 'holdingStatementsForSupplements',
        enabled: true,
        path: 'holdings.holdingStatementsForSupplements',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.holdingStatementsForSupplements[]',
          fields: [{
            order: 0,
            name: 'statement',
            enabled: true,
            path: 'holdings.holdingStatementsForSupplements[].statement',
            value: 'test1',
          }, {
            order: 0,
            name: 'note',
            enabled: true,
            path: 'holdings.holdingStatementsForSupplements[].note',
            value: 'test1',
          }],
        }],
      }, {
        name: 'holdingStatementsForIndexes',
        enabled: true,
        path: 'holdings.holdingStatementsForIndexes',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.holdingStatementsForIndexes[]',
          fields: [{
            order: 0,
            name: 'statement',
            enabled: true,
            path: 'holdings.holdingStatementsForIndexes[].statement',
            value: 'test1',
          }, {
            order: 0,
            name: 'note',
            enabled: true,
            path: 'holdings.holdingStatementsForIndexes[].note',
            value: 'test1',
          }],
        }],
      }, {
        name: 'notes',
        enabled: true,
        path: 'holdings.notes',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.notes[]',
          fields: [{
            order: 0,
            name: 'noteType',
            enabled: true,
            path: 'holdings.notes[].noteType',
            value: 'test1',
          }, {
            order: 1,
            name: 'note',
            enabled: true,
            path: 'holdings.notes[].note',
            value: 'test1',
          }, {
            order: 2,
            name: 'staffOnly',
            enabled: true,
            path: 'holdings.notes[].staffOnly',
            value: null,
            booleanFieldAction: 'AS_IS',
          }],
        }],
      }, {
        name: 'electronicAccess',
        enabled: true,
        path: 'holdings.electronicAccess',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.electronicAccess[]',
          fields: [{
            order: 0,
            name: 'relationshipId',
            enabled: true,
            path: 'holdings.electronicAccess[].relationshipId',
            value: 'test1',
          }, {
            order: 1,
            name: 'uri',
            enabled: true,
            path: 'holdings.electronicAccess[].uri',
            value: 'test1',
          }, {
            order: 2,
            name: 'linkText',
            enabled: true,
            path: 'holdings.electronicAccess[].linkText',
            value: 'test1',
          }, {
            order: 3,
            name: 'materialsSpecification',
            enabled: true,
            path: 'holdings.electronicAccess[].materialsSpecification',
            value: 'test1',
          }, {
            order: 4,
            name: 'publicNote',
            enabled: true,
            path: 'holdings.electronicAccess[].publicNote',
            value: 'test1',
          }],
        }],
      }, {
        name: 'receivingHistory.entries',
        enabled: true,
        path: 'holdings.receivingHistory.entries',
        value: '',
        subfields: [{
          order: 0,
          path: 'holdings.receivingHistory.entries[]',
          fields: [{
            order: 0,
            name: 'publicDisplay',
            enabled: true,
            path: 'holdings.receivingHistory.entries[].publicDisplay',
            value: null,
            booleanFieldAction: 'AS_IS',
          }, {
            order: 0,
            name: 'enumeration',
            enabled: true,
            path: 'holdings.receivingHistory.entries[].enumeration',
            value: 'test1',
          }, {
            order: 0,
            name: 'chronology',
            enabled: true,
            path: 'holdings.receivingHistory.entries[].chronology',
            value: 'test1',
          }],
        }],
      }],
    },
  });
  server.create('mapping-profile', {
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'ITEM',
    mappingDetails: {
      name: 'holdings',
      recordType: 'HOLDINGS',
      mappingFields: [{
        name: 'formerIds',
        enabled: true,
        path: 'item.formerIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.formerIds[]',
          fields: [{
            order: 0,
            name: 'formerId',
            enabled: true,
            path: 'item.formerIds[].formerId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'statisticalCodeIds',
        enabled: true,
        path: 'item.statisticalCodeIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.statisticalCodeIds[]',
          fields: [{
            order: 0,
            name: 'statisticalCodeId',
            enabled: true,
            path: 'item.statisticalCodeIds[].statisticalCodeId',
            value: 'test1',
          }],
        }],
      }, {
        name: 'yearCaption',
        enabled: true,
        path: 'item.yearCaption',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.yearCaption[]',
          fields: [{
            order: 0,
            name: 'yearCaption',
            enabled: true,
            path: 'item.yearCaption[].yearCaption',
            value: 'test1',
          }],
        }],
      }, {
        name: 'notes',
        enabled: true,
        path: 'item.notes',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.notes[]',
          fields: [{
            order: 0,
            name: 'itemNoteTypeId',
            enabled: true,
            path: 'item.notes[].itemNoteTypeId',
            value: 'test1',
          }, {
            order: 1,
            name: 'note',
            enabled: true,
            path: 'item.notes[].note',
            value: 'test1',
          }, {
            order: 2,
            name: 'staffOnly',
            enabled: true,
            path: 'item.notes[].staffOnly',
            value: null,
            booleanFieldAction: 'AS_IS',
          }],
        }],
      }, {
        name: 'circulationNotes',
        enabled: true,
        path: 'item.circulationNotes',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.circulationNotes[]',
          fields: [{
            order: 0,
            name: 'noteType',
            enabled: true,
            path: 'item.circulationNotes[].noteType',
            value: 'test1',
          }, {
            order: 1,
            name: 'note',
            enabled: true,
            path: 'item.circulationNotes[].note',
            value: 'test1',
          }, {
            order: 2,
            name: 'staffOnly',
            enabled: true,
            path: 'item.circulationNotes[].staffOnly',
            value: null,
            booleanFieldAction: 'AS_IS',
          }],
        }],
      }, {
        name: 'electronicAccess',
        enabled: true,
        path: 'item.electronicAccess',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.electronicAccess[]',
          fields: [{
            order: 0,
            name: 'relationshipId',
            enabled: true,
            path: 'item.electronicAccess[].relationshipId',
            value: 'test1',
          }, {
            order: 1,
            name: 'uri',
            enabled: true,
            path: 'item.electronicAccess[].uri',
            value: 'test1',
          }, {
            order: 2,
            name: 'linkText',
            enabled: true,
            path: 'item.electronicAccess[].linkText',
            value: 'test1',
          }, {
            order: 3,
            name: 'materialsSpecification',
            enabled: true,
            path: 'item.electronicAccess[].materialsSpecification',
            value: 'test1',
          }, {
            order: 4,
            name: 'publicNote',
            enabled: true,
            path: 'item.electronicAccess[].publicNote',
            value: 'test1',
          }],
        }],
      }],
    },
  });
  server.create('mapping-profile', {
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'MARC_BIBLIOGRAPHIC',
  });
  server.createList('mapping-profile', 1);

  server.get('/data-import-profiles/mappingProfiles', (schema, request) => {
    const { query = '' } = request.queryParams;
    const mappingProfiles = schema.mappingProfiles.all();

    const searchPattern = /name="([\w\s]+)/;

    return searchEntityByQuery({
      query,
      entity: mappingProfiles,
      searchPattern,
      fieldsToMatch: [
        'name',
        'mapped',
        'tags.tagList',
      ],
    });
  });
  server.get('/data-import-profiles/mappingProfiles/:id');
  server.delete('/data-import-profiles/mappingProfiles/:id', {}, 409);
  server.post('/data-import-profiles/mappingProfiles', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('mapping-profile', params.profile);

    return record.attrs;
  });
  server.put('/data-import-profiles/mappingProfiles/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const mappingProfileModel = schema.mappingProfiles.find(id);
    const updatedMappingProfile = JSON.parse(requestBody);

    mappingProfileModel.update({ ...updatedMappingProfile.profile });

    return mappingProfileModel.attrs;
  });
};
