import { isEmpty } from 'lodash';

import { FIELD_NAME_PREFIX } from './constants';
import {
  ENTITY_KEYS,
  FORMS_SETTINGS,
} from '../../../utils';

export const getFieldName = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].value`;
};

export const getRepeatableFieldName = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].repeatableFieldAction`;
};

export const getBoolFieldName = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].booleanFieldAction`;
};

export const getSubfieldName = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].value`;
};

export const getBoolSubfieldName = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].booleanFieldAction`;
};

export const onAdd = (refTable, fieldName, fieldIndex, initialFields, callback, incrementalField) => {
  const fieldsPath = `profile.mappingDetails.mappingFields[${fieldIndex}].subfields`;
  let newInitRow = { ...initialFields[fieldName] };

  if (incrementalField) {
    newInitRow = {
      ...newInitRow,
      [incrementalField]: refTable.length,
    };
  }

  refTable.push(newInitRow);
  callback(fieldsPath, refTable);
};

export const onRemove = (index, refTable, fieldIndex, callback, incrementalField) => {
  const fieldsPath = `profile.mappingDetails.mappingFields[${fieldIndex}].subfields`;
  let newRefTable = [...refTable];

  newRefTable.splice(index, 1);

  if (incrementalField) {
    newRefTable = newRefTable.map((row, i) => ({
      ...row,
      [incrementalField]: i,
    }));
  }

  callback(fieldsPath, newRefTable);
};

export const getFieldValue = (details, fieldName, key) => details.find(item => item.name === fieldName)?.[key];

export const transformSubfieldsData = (subfields, columns) => subfields.map(item => {
  let currentRow = {};

  columns.forEach(columnName => {
    const fieldValue = item?.fields.find(field => field.name === columnName).value;

    currentRow = {
      ...currentRow,
      [columnName]: fieldValue,
    };
  });

  return currentRow;
});

export const getContentData = fields => (!isEmpty(fields) ? fields : [{}]);

export const getBooleanLabelId = fieldValue => {
  const booleanActions = FORMS_SETTINGS[ENTITY_KEYS.MAPPING_PROFILES].DECORATORS.BOOLEAN_ACTIONS;

  return booleanActions.find(action => action.value === fieldValue)?.label;
};
