import React from 'react';
import { fieldsConfig } from './fields-config';
import { getCategoryId } from './getDropdownOptions';

export const getFieldMatchedWithCategory = (value, recordType, intl) => {
  if (!value || !recordType) {
    return undefined;
  }

  const isMarcRecord = recordType.toLowerCase().includes('marc');

  if (isMarcRecord) {
    return value;
  }

  const field = fieldsConfig.find(item => item.value === value);
  const fieldValue = intl.formatMessage({ id: field.label });
  const categoryValue = intl.formatMessage({ id: getCategoryId(field).label });
  const fieldLabel = `${categoryValue}: ${fieldValue}`;

  return fieldLabel || undefined;
};
