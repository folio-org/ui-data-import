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
        name: 'discoverySuppress',
        enabled: true,
        path: 'instance.discoverySuppress',
        value: null,
        subfields: [],
        booleanFieldAction: 'IGNORE',
      }, {
        name: 'staffSuppress',
        enabled: true,
        path: 'instance.staffSuppress',
        value: null,
        subfields: [],
        booleanFieldAction: 'IGNORE',
      }, {
        name: 'previouslyHeld',
        enabled: true,
        path: 'instance.previouslyHeld',
        value: null,
        subfields: [],
        booleanFieldAction: 'IGNORE',
      }, {
        name: 'hrid',
        enabled: false,
        path: 'instance.hrid',
        value: '910',
        subfields: [],
      }, {
        name: 'source',
        enabled: false,
        path: 'instance.source',
        value: '910',
        subfields: [],
      }, {
        name: 'catalogedDate',
        enabled: true,
        path: 'instance.catalogedDate',
        value: '910',
        subfields: [],
      }, {
        name: 'statusId',
        enabled: true,
        path: 'instance.statusId',
        value: '910',
        subfields: [],
      }, {
        name: 'modeOfIssuanceId',
        enabled: false,
        path: 'instance.modeOfIssuanceId',
        value: '910',
        subfields: [],
      }, {
        name: 'statisticalCodeIds',
        enabled: true,
        path: 'instance.statisticalCodeIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.statisticalCodeIds[]',
          fields: [{
            // order: 0,
            name: 'statisticalCodeId',
            enabled: true,
            path: 'instance.statisticalCodeIds[].statisticalCodeId',
            value: '910',
          }],
        }],
      }, {
        name: 'title',
        enabled: false,
        path: 'instance.title',
        value: '910',
        subfields: [],
      }, {
        name: 'alternativeTitles',
        enabled: false,
        path: 'instance.alternativeTitles',
        value: '910',
        subfields: [{
          order: 0,
          path: 'instance.alternativeTitles[]',
          fields: [{
            // order: 0,
            name: 'alternativeTitleTypeId',
            enabled: false,
            path: 'instance.alternativeTitles[].alternativeTitleTypeId',
            value: '910',
          }, {
            // order: 1,
            name: 'alternativeTitle',
            enabled: false,
            path: 'instance.alternativeTitles[].alternativeTitle',
            value: '910',
          }],
        }],
      }, {
        name: 'indexTitle',
        enabled: false,
        path: 'instance.indexTitle',
        value: '910',
        subfields: [],
      }, {
        name: 'series',
        enabled: false,
        path: 'instance.series',
        value: '910',
        subfields: [{
          order: 0,
          path: 'instance.series[]',
          fields: [{
            // order: 0,
            name: 'source',
            enabled: false,
            path: 'instance.series[].source',
            value: '910',
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
            // order: 0,
            name: 'precedingTitlesTitle',
            enabled: true,
            path: 'instance.precedingTitles[].title',
            value: '910',
          }, {
            // order: 1,
            name: 'precedingTitlesHrid',
            enabled: true,
            path: 'instance.precedingTitles[].hrid',
            value: '910',
          }, {
            // order: 2,
            name: 'precedingTitlesIsbn',
            enabled: true,
            path: 'instance.precedingTitles[].identifiers[].value',
            value: '910',
          }, {
            // order: 3,
            name: 'precedingTitlesIssn',
            enabled: true,
            path: 'instance.precedingTitles[].identifiers[].value',
            value: '910',
          }],
        }],
      }, {
        name: 'succeedingTitles',
        enabled: false,
        path: 'instance.succeedingTitles',
        value: '910',
        subfields: [{
          order: 0,
          path: 'instance.succeedingTitles[]',
          fields: [{
            // order: 0,
            name: 'succeedingTitlesTitle',
            enabled: true,
            path: 'instance.succeedingTitles[].title',
            value: '910',
          }, {
            // order: 1,
            name: 'succeedingTitlesHrid',
            enabled: true,
            path: 'instance.succeedingTitles[].hrid',
            value: '910',
          }, {
            // order: 2,
            name: 'succeedingTitlesIsbn',
            enabled: true,
            path: 'instance.succeedingTitles[].identifiers[].value',
            value: '910',
          }, {
            // order: 3,
            name: 'succeedingTitlesIssn',
            enabled: true,
            path: 'instance.succeedingTitles[].identifiers[].value',
            value: '910',
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
            // order: 0,
            name: 'identifierTypeId',
            enabled: false,
            path: 'instance.identifiers[].identifierTypeId',
            value: '910',
          }, {
            // order: 1,
            name: 'value',
            enabled: false,
            path: 'instance.identifiers[].value',
            value: '910',
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
            // order: 0,
            name: 'contributorName',
            enabled: false,
            path: 'instance.contributors[].contributorName',
            value: '910',
          }, {
            // order: 0,
            name: 'contributorNameTypeId',
            enabled: false,
            path: 'instance.contributors[].contributorNameTypeId',
            value: '910',
          }, {
            // order: 1,
            name: 'contributorTypeId',
            enabled: false,
            path: 'instance.contributors[].contributorTypeId',
            value: '910',
          }, {
            // order: 2,
            name: 'contributorTypeText',
            enabled: false,
            path: 'instance.contributors[].contributorTypeText',
            value: '910',
          }, {
            // order: 3,
            name: 'primary',
            enabled: false,
            path: 'instance.contributors[].primary',
            value: '',
            booleanFieldAction: 'IGNORE',
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
            // order: 0,
            name: 'publisher',
            enabled: false,
            path: 'instance.publication[].publisher',
            value: '910',
          }, {
            // order: 1,
            name: 'role',
            enabled: false,
            path: 'instance.publication[].role',
            value: '910',
          }, {
            // order: 2,
            name: 'place',
            enabled: false,
            path: 'instance.publication[].place',
            value: '910',
          }, {
            // order: 3,
            name: 'dateOfPublication',
            enabled: false,
            path: 'instance.publication[].dateOfPublication',
            value: '910',
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
            // order: 0,
            name: 'edition',
            enabled: false,
            path: 'instance.editions[].edition',
            value: '910',
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
            // order: 0,
            name: 'physicalDescription',
            enabled: false,
            path: 'instance.physicalDescriptions[].physicalDescription',
            value: '910',
          }],
        }],
      }, {
        name: 'instanceTypeId',
        enabled: false,
        path: 'instance.instanceTypeId',
        value: '910',
        subfields: [],
      }, {
        name: 'natureOfContentTermIds',
        enabled: true,
        path: 'instance.natureOfContentTermIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'instance.natureOfContentTermIds[]',
          fields: [{
            // order: 0,
            name: 'natureOfContentTermId',
            enabled: true,
            path: 'instance.natureOfContentTermIds[].natureOfContentTermId',
            value: '910',
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
            // order: 0,
            name: 'instanceFormatId',
            enabled: false,
            path: 'instance.instanceFormatIds[].instanceFormatId',
            value: '910',
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
            // order: 0,
            name: 'languageId',
            enabled: false,
            path: 'instance.languages[].languageId',
            value: '910',
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
            // order: 0,
            name: 'publicationFrequency',
            enabled: false,
            path: 'instance.publicationFrequency[].publicationFrequency',
            value: '910',
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
            // order: 0,
            name: 'publicationRange',
            enabled: false,
            path: 'instance.publicationRange[].publicationRange',
            value: '910',
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
            // order: 0,
            name: 'noteType',
            enabled: false,
            path: 'instance.notes[].noteType',
            value: '910',
          }, {
            // order: 1,
            name: 'note',
            enabled: false,
            path: 'instance.notes[].note',
            value: '910',
          }, {
            // order: 2,
            name: 'staffOnly',
            enabled: false,
            path: 'instance.notes[].staffOnly',
            value: null,
            booleanFieldAction: 'IGNORE',
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
            // order: 0,
            name: 'relationshipId',
            enabled: false,
            path: 'instance.electronicAccess[].relationshipId',
            value: '910',
          }, {
            // order: 1,
            name: 'uri',
            enabled: false,
            path: 'instance.electronicAccess[].uri',
            value: '910',
          }, {
            // order: 2,
            name: 'linkText',
            enabled: false,
            path: 'instance.electronicAccess[].linkText',
            value: '910',
          }, {
            // order: 3,
            name: 'materialsSpecification',
            enabled: false,
            path: 'instance.electronicAccess[].materialsSpecification',
            value: '910',
          }, {
            // order: 4,
            name: 'publicNote',
            enabled: false,
            path: 'instance.electronicAccess[].publicNote',
            value: '910',
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
            // order: 0,
            name: 'subject',
            enabled: false,
            path: 'instance.subjects[].subject',
            value: '910',
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
            // order: 0,
            name: 'classificationTypeId',
            enabled: false,
            path: 'instance.classifications[].classificationTypeId',
            value: '910',
          }, {
            // order: 1,
            name: 'classificationNumber',
            enabled: false,
            path: 'instance.classifications[].classificationNumber',
            value: '910',
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
            // order: 0,
            name: 'superInstanceId',
            enabled: true,
            path: 'instance.parentInstances[].superInstanceId',
            value: '910',
          }, {
            // order: 1,
            name: 'instanceRelationshipTypeId',
            enabled: true,
            path: 'instance.parentInstances[].instanceRelationshipTypeId',
            value: '910',
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
            // order: 0,
            name: 'subInstanceId',
            enabled: true,
            path: 'instance.childInstances[].subInstanceId',
            value: '910',
          }, {
            // order: 1,
            name: 'instanceRelationshipTypeId',
            enabled: true,
            path: 'instance.childInstances[].instanceRelationshipTypeId',
            value: '910',
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
        name: 'discoverySuppress',
        enabled: true,
        path: 'holdings.discoverySuppress',
        value: '',
        subfields: [],
        booleanFieldAction: 'IGNORE',
      }, {
        name: 'hrid',
        enabled: false,
        path: 'holdings.discoverySuppress',
        value: '',
        subfields: [],
      }, {
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
            value: '910',
          }],
        }],
      }, {
        name: 'holdingsTypeId',
        enabled: false,
        path: 'holdings.holdingsTypeId',
        value: '',
        subfields: [],
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
            value: '910',
          }],
        }],
      }, {
        name: 'permanentLocationId',
        enabled: true,
        path: 'holdings.permanentLocationId',
        value: '910',
        subfields: [],
      }, {
        name: 'temporaryLocationId',
        enabled: true,
        path: 'holdings.temporaryLocationId',
        value: '910',
        subfields: [],
      }, {
        name: 'shelvingOrder',
        enabled: true,
        path: 'holdings.shelvingOrder',
        value: '910',
        subfields: [],
      }, {
        name: 'shelvingTitle',
        enabled: true,
        path: 'holdings.shelvingTitle',
        value: '910',
        subfields: [],
      }, {
        name: 'copyNumber',
        enabled: true,
        path: 'holdings.copyNumber',
        value: '910',
        subfields: [],
      }, {
        name: 'callNumberTypeId',
        enabled: true,
        path: 'holdings.callNumberTypeId',
        value: '910',
        subfields: [],
      }, {
        name: 'callNumberPrefix',
        enabled: true,
        path: 'holdings.callNumberPrefix',
        value: '910',
        subfields: [],
      }, {
        name: 'callNumber',
        enabled: true,
        path: 'holdings.callNumber',
        value: '910',
        subfields: [],
      }, {
        name: 'callNumberSuffix',
        enabled: true,
        path: 'holdings.callNumberSuffix',
        value: '910',
        subfields: [],
      }, {
        name: 'numberOfItems',
        enabled: true,
        path: 'holdings.numberOfItems',
        value: '910',
        subfields: [],
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
            value: '910',
          }, {
            order: 0,
            name: 'note',
            enabled: true,
            path: 'holdings.holdingStatements[].note',
            value: '910',
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
            value: '910',
          }, {
            order: 0,
            name: 'note',
            enabled: true,
            path: 'holdings.holdingStatementsForSupplements[].note',
            value: '910',
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
            value: '910',
          }, {
            order: 0,
            name: 'note',
            enabled: true,
            path: 'holdings.holdingStatementsForIndexes[].note',
            value: '910',
          }],
        }],
      }, {
        name: 'illPolicyId',
        enabled: true,
        path: 'holdings.illPolicyId',
        value: '910',
        subfields: [],
      }, {
        name: 'digitalizationPolicy',
        enabled: true,
        path: 'holdings.digitalizationPolicy',
        value: '910',
        subfields: [],
      }, {
        name: 'retentionPolicy',
        enabled: true,
        path: 'holdings.retentionPolicy',
        value: '910',
        subfields: [],
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
            value: '910',
          }, {
            // order: 1,
            name: 'note',
            enabled: true,
            path: 'holdings.notes[].note',
            value: '910',
          }, {
            // order: 2,
            name: 'staffOnly',
            enabled: true,
            path: 'holdings.notes[].staffOnly',
            value: null,
            booleanFieldAction: 'IGNORE',
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
            value: '910',
          }, {
            // order: 1,
            name: 'uri',
            enabled: true,
            path: 'holdings.electronicAccess[].uri',
            value: '910',
          }, {
            // order: 2,
            name: 'linkText',
            enabled: true,
            path: 'holdings.electronicAccess[].linkText',
            value: '910',
          }, {
            // order: 3,
            name: 'materialsSpecification',
            enabled: true,
            path: 'holdings.electronicAccess[].materialsSpecification',
            value: '910',
          }, {
            // order: 4,
            name: 'publicNote',
            enabled: true,
            path: 'holdings.electronicAccess[].publicNote',
            value: '910',
          }],
        }],
      }, {
        name: 'acquisitionMethod',
        enabled: true,
        path: 'holdings.acquisitionMethod',
        value: '910',
        subfields: [],
      }, {
        name: 'acquisitionFormat',
        enabled: true,
        path: 'holdings.acquisitionFormat',
        value: '910',
        subfields: [],
      }, {
        name: 'receiptStatus',
        enabled: true,
        path: 'holdings.receiptStatus',
        value: '910',
        subfields: [],
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
            booleanFieldAction: 'IGNORE',
          }, {
            order: 0,
            name: 'enumeration',
            enabled: true,
            path: 'holdings.receivingHistory.entries[].enumeration',
            value: '910',
          }, {
            order: 0,
            name: 'chronology',
            enabled: true,
            path: 'holdings.receivingHistory.entries[].chronology',
            value: '910',
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
        name: 'discoverySuppress',
        enabled: true,
        path: 'item.discoverySuppress',
        value: null,
        booleanFieldAction: 'IGNORE',
        subfields: [],
      }, {
        name: 'hrid',
        enabled: true,
        path: 'item.hrid',
        value: '910',
        subfields: [],
      }, {
        name: 'barcode',
        enabled: true,
        path: 'item.barcode',
        value: '910',
        subfields: [],
      }, {
        name: 'accessionNumber',
        enabled: true,
        path: 'item.accessionNumber',
        value: '910',
        subfields: [],
      }, {
        name: 'itemIdentifier',
        enabled: true,
        path: 'item.itemIdentifier',
        value: '910',
        subfields: [],
      }, {
        name: 'formerIds',
        enabled: true,
        path: 'item.formerIds',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.formerIds[]',
          fields: [{
            // order: 0,
            name: 'formerId',
            enabled: true,
            path: 'item.formerIds[].formerId',
            value: '910',
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
            // order: 0,
            name: 'statisticalCodeId',
            enabled: true,
            path: 'item.statisticalCodeIds[].statisticalCodeId',
            value: '910',
          }],
        }],
      }, {
        name: 'materialType.id',
        enabled: true,
        path: 'item.materialType.id',
        value: '910',
        subfields: [],
      }, {
        name: 'copyNumber',
        enabled: true,
        path: 'item.copyNumber',
        value: '910',
        subfields: [],
      }, {
        name: 'itemLevelCallNumberTypeId',
        enabled: true,
        path: 'item.itemLevelCallNumberTypeId',
        value: '910',
        subfields: [],
      }, {
        name: 'itemLevelCallNumberPrefix',
        enabled: true,
        path: 'item.itemLevelCallNumberPrefix',
        value: '910',
        subfields: [],
      }, {
        name: 'itemLevelCallNumber',
        enabled: true,
        path: 'item.itemLevelCallNumber',
        value: '910',
        subfields: [],
      }, {
        name: 'itemLevelCallNumberSuffix',
        enabled: true,
        path: 'item.itemLevelCallNumberSuffix',
        value: '910',
        subfields: [],
      }, {
        name: 'numberOfPieces',
        enabled: true,
        path: 'item.numberOfPieces',
        value: '910',
        subfields: [],
      }, {
        name: 'descriptionOfPieces',
        enabled: true,
        path: 'item.descriptionOfPieces',
        value: '910',
        subfields: [],
      }, {
        name: 'enumeration',
        enabled: true,
        path: 'item.enumeration',
        value: '910',
        subfields: [],
      }, {
        name: 'chronology',
        enabled: true,
        path: 'item.chronology',
        value: '910',
        subfields: [],
      }, {
        name: 'volume',
        enabled: true,
        path: 'item.volume',
        value: '910',
        subfields: [],
      }, {
        name: 'yearCaption',
        enabled: true,
        path: 'item.yearCaption',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.yearCaption[]',
          fields: [{
            // order: 0,
            name: 'yearCaption',
            enabled: true,
            path: 'item.yearCaption[].yearCaption',
            value: '910',
          }],
        }],
      }, {
        name: 'numberOfMissingPieces',
        enabled: true,
        path: 'item.numberOfMissingPieces',
        value: '910',
        subfields: [],
      }, {
        name: 'missingPieces',
        enabled: true,
        path: 'item.missingPieces',
        value: '910',
        subfields: [],
      }, {
        name: 'missingPiecesDate',
        enabled: true,
        path: 'item.missingPiecesDate',
        value: '910',
        subfields: [],
      }, {
        name: 'itemDamagedStatusId',
        enabled: true,
        path: 'item.itemDamagedStatusId',
        value: '910',
        subfields: [],
      }, {
        name: 'itemDamagedStatusDate',
        enabled: true,
        path: 'item.itemDamagedStatusDate',
        value: '910',
        subfields: [],
      }, {
        name: 'notes',
        enabled: true,
        path: 'item.notes',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.notes[]',
          fields: [{
            // order: 0,
            name: 'itemNoteTypeId',
            enabled: true,
            path: 'item.notes[].itemNoteTypeId',
            value: '910',
          }, {
            // order: 1,
            name: 'note',
            enabled: true,
            path: 'item.notes[].note',
            value: '910',
          }, {
            // order: 2,
            name: 'staffOnly',
            enabled: true,
            path: 'item.notes[].staffOnly',
            value: null,
            booleanFieldAction: 'IGNORE',
          }],
        }],
      }, {
        name: 'permanentLoanType.id',
        enabled: true,
        path: 'item.permanentLoanType.id',
        value: '910',
        subfields: [],
      }, {
        name: 'temporaryLoanType.id',
        enabled: true,
        path: 'item.temporaryLoanType.id',
        value: '910',
        subfields: [],
      }, {
        name: 'status.name',
        enabled: true,
        path: 'item.status.name',
        value: '910',
        subfields: [],
      }, {
        name: 'circulationNotes',
        enabled: true,
        path: 'item.circulationNotes',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.circulationNotes[]',
          fields: [{
            // order: 0,
            name: 'noteType',
            enabled: true,
            path: 'item.circulationNotes[].noteType',
            value: '910',
          }, {
            // order: 1,
            name: 'note',
            enabled: true,
            path: 'item.circulationNotes[].note',
            value: '910',
          }, {
            // order: 2,
            name: 'staffOnly',
            enabled: true,
            path: 'item.circulationNotes[].staffOnly',
            value: null,
            booleanFieldAction: 'IGNORE',
          }],
        }],
      }, {
        name: 'permanentLocation.id',
        enabled: true,
        path: 'item.permanentLocation.id',
        value: '910',
        subfields: [],
      }, {
        name: 'temporaryLocation.id',
        enabled: true,
        path: 'item.temporaryLocation.id',
        value: '910',
        subfields: [],
      }, {
        name: 'electronicAccess',
        enabled: true,
        path: 'item.electronicAccess',
        value: '',
        subfields: [{
          order: 0,
          path: 'item.electronicAccess[]',
          fields: [{
            // order: 0,
            name: 'relationshipId',
            enabled: true,
            path: 'item.electronicAccess[].relationshipId',
            value: '910',
          }, {
            // order: 1,
            name: 'uri',
            enabled: true,
            path: 'item.electronicAccess[].uri',
            value: '910',
          }, {
            // order: 2,
            name: 'linkText',
            enabled: true,
            path: 'item.electronicAccess[].linkText',
            value: '910',
          }, {
            // order: 3,
            name: 'materialsSpecification',
            enabled: true,
            path: 'item.electronicAccess[].materialsSpecification',
            value: '910',
          }, {
            // order: 4,
            name: 'publicNote',
            enabled: true,
            path: 'item.electronicAccess[].publicNote',
            value: '910',
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
