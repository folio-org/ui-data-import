import React from 'react';
import { fieldsConfig } from './fields-config';
import { getCategoryId } from './getDropdownOptions';
import { isMARCType } from './isMARCType';

export const getFieldMatchedWithCategory = (value, recordType, intl) => {
  if (!value || !recordType) {
    return undefined;
  }

  const isMarcRecord = isMARCType(recordType);

  if (isMarcRecord) {
    return value;
  }

  const field = fieldsConfig.find(item => item.value === value);
  const category = getCategoryId(field);
  const fieldValue = intl.formatMessage({ id: field.label });
  const categoryValue = intl.formatMessage({ id: category.label });
  const fieldLabel = `${categoryValue}: ${fieldValue}`;

  return fieldLabel || undefined;
};
