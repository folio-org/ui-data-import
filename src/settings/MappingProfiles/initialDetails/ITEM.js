const ITEM = {
  name: 'item',
  recordType: 'ITEM',
  mappingFields: [{
    name: 'discoverySuppress',
    enabled: true,
    path: 'item.discoverySuppress',
    value: null,
    booleanFieldAction: '',
    subfields: [],
  }, {
    name: 'hrid',
    enabled: true,
    path: 'item.hrid',
    value: '',
    subfields: [],
  }, {
    name: 'barcode',
    enabled: true,
    path: 'item.barcode',
    value: '',
    subfields: [],
  }, {
    name: 'accessionNumber',
    enabled: true,
    path: 'item.accessionNumber',
    value: '',
    subfields: [],
  }, {
    name: 'itemIdentifier',
    enabled: true,
    path: 'item.itemIdentifier',
    value: '',
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
        value: '',
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
        value: '',
      }],
    }],
  }, {
    name: 'materialType.id',
    enabled: true,
    path: 'item.materialType.id',
    value: '',
    subfields: [],
  }, {
    name: 'copyNumber',
    enabled: true,
    path: 'item.copyNumber',
    value: '',
    subfields: [],
  }, {
    name: 'itemLevelCallNumberTypeId',
    enabled: true,
    path: 'item.itemLevelCallNumberTypeId',
    value: '',
    subfields: [],
  }, {
    name: 'itemLevelCallNumberPrefix',
    enabled: true,
    path: 'item.itemLevelCallNumberPrefix',
    value: '',
    subfields: [],
  }, {
    name: 'itemLevelCallNumber',
    enabled: true,
    path: 'item.itemLevelCallNumber',
    value: '',
    subfields: [],
  }, {
    name: 'itemLevelCallNumberSuffix',
    enabled: true,
    path: 'item.itemLevelCallNumberSuffix',
    value: '',
    subfields: [],
  }, {
    name: 'numberOfPieces',
    enabled: true,
    path: 'item.numberOfPieces',
    value: '',
    subfields: [],
  }, {
    name: 'descriptionOfPieces',
    enabled: true,
    path: 'item.descriptionOfPieces',
    value: '',
    subfields: [],
  }, {
    name: 'enumeration',
    enabled: true,
    path: 'item.enumeration',
    value: '',
    subfields: [],
  }, {
    name: 'chronology',
    enabled: true,
    path: 'item.chronology',
    value: '',
    subfields: [],
  }, {
    name: 'volume',
    enabled: true,
    path: 'item.volume',
    value: '',
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
        value: '',
      }],
    }],
  }, {
    name: 'numberOfMissingPieces',
    enabled: true,
    path: 'item.numberOfMissingPieces',
    value: '',
    subfields: [],
  }, {
    name: 'missingPieces',
    enabled: true,
    path: 'item.missingPieces',
    value: '',
    subfields: [],
  }, {
    name: 'missingPiecesDate',
    enabled: true,
    path: 'item.missingPiecesDate',
    value: '',
    subfields: [],
  }, {
    name: 'itemDamagedStatusId',
    enabled: true,
    path: 'item.itemDamagedStatusId',
    value: '',
    subfields: [],
  }, {
    name: 'itemDamagedStatusDate',
    enabled: true,
    path: 'item.itemDamagedStatusDate',
    value: '',
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
        value: '',
      }, {
        // order: 1,
        name: 'note',
        enabled: true,
        path: 'item.notes[].note',
        value: '',
      }, {
        // order: 2,
        name: 'staffOnly',
        enabled: true,
        path: 'item.notes[].staffOnly',
        value: null,
        booleanFieldAction: '',
      }],
    }],
  }, {
    name: 'permanentLoanType.id',
    enabled: true,
    path: 'item.permanentLoanType.id',
    value: '',
    subfields: [],
  }, {
    name: 'temporaryLoanType.id',
    enabled: true,
    path: 'item.temporaryLoanType.id',
    value: '',
    subfields: [],
  }, {
    name: 'status.name',
    enabled: true,
    path: 'item.status.name',
    value: '',
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
        value: '',
      }, {
        // order: 1,
        name: 'note',
        enabled: true,
        path: 'item.circulationNotes[].note',
        value: '',
      }, {
        // order: 2,
        name: 'staffOnly',
        enabled: true,
        path: 'item.circulationNotes[].staffOnly',
        value: null,
        booleanFieldAction: '',
      }],
    }],
  }, {
    name: 'permanentLocation.id',
    enabled: true,
    path: 'item.permanentLocation.id',
    value: '',
    subfields: [],
  }, {
    name: 'temporaryLocation.id',
    enabled: true,
    path: 'item.temporaryLocation.id',
    value: '',
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
        value: '',
      }, {
        // order: 1,
        name: 'uri',
        enabled: true,
        path: 'item.electronicAccess[].uri',
        value: '',
      }, {
        // order: 2,
        name: 'linkText',
        enabled: true,
        path: 'item.electronicAccess[].linkText',
        value: '',
      }, {
        // order: 3,
        name: 'materialsSpecification',
        enabled: true,
        path: 'item.electronicAccess[].materialsSpecification',
        value: '',
      }, {
        // order: 4,
        name: 'publicNote',
        enabled: true,
        path: 'item.electronicAccess[].publicNote',
        value: '',
      }],
    }],
  }],
};

export default ITEM;
