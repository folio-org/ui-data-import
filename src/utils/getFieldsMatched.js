import React from 'react';
import { FormattedMessage } from 'react-intl';
import { fieldsConfig } from './fields-config';

export const getFieldMatched = (value, recordType) => {
  if (!value || !recordType) {
    return undefined;
  }

  const isMarcRecord = recordType.toLowerCase().includes('marc');

  if (isMarcRecord) {
    return value;
  }

  const field = fieldsConfig.find(item => item.value === value);

  return field ? <FormattedMessage id={field.label} /> : undefined;
};
