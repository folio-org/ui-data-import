import React from 'react';

import { get } from 'lodash';

import { NoValue } from '@folio/stripes-components';

export const getFieldValue = (mappingFields, fieldName) => {
  if (!mappingFields) {
    return (<NoValue />);
  }

  const mappingField = mappingFields.find(field => field.name === fieldName);

  return get(mappingField, ['value'], (<NoValue />));
};

export const getSubfieldValue = (mappingFields, fieldName, subFieldName) => {
  if (!mappingFields) {
    return (<NoValue />);
  }

  const mappingField = mappingFields.find(field => field.name === fieldName);
  const subfield = mappingField.subfields?.find(subfield => subfield.name === subFieldName);

  return get(subfield, ['value'], (<NoValue />));
};

export const getSubfields = (mappingFields, fieldName) => mappingFields?.find(field => field.name === fieldName)?.subfields || [{}];
