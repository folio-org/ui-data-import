import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import { NoValue } from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../components';

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

export const getAcceptedValuesPath = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].acceptedValues`;
};

export const getRepeatableAcceptedValuesPath = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].acceptedValues`;
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

  if (newRefTable.length === 0) {
    const repeatableActionFieldPath = getRepeatableFieldName(fieldIndex);

    callback(repeatableActionFieldPath, null);
  }

  callback(fieldsPath, newRefTable);
};

export const getFieldValue = (details, fieldName, key) => details.find(item => item.name === fieldName)?.[key];

export const getValueById = id => (id ? <FormattedMessage id={id} /> : <NoValue />);

export const getUnmappableValueById = id => (id ? <FormattedMessage id={id} /> : <ProhibitionIcon />);

export const transformSubfieldsData = (subfields, columns) => subfields?.map(item => {
  return columns.reduce((acc, column) => {
    const fieldValue = item?.fields.find(field => field.name === column.field)?.[column.key];

    return {
      ...acc,
      [column.field]: fieldValue,
    };
  }, {});
});

export const getContentData = fields => (!isEmpty(fields) ? fields : [{}]);

export const getBooleanLabelId = fieldValue => {
  const booleanActions = FORMS_SETTINGS[ENTITY_KEYS.MAPPING_PROFILES].DECORATORS.BOOLEAN_ACTIONS;

  return booleanActions.find(action => action.value === fieldValue)?.label;
};
