import { fieldsConfig } from './fields-config';
import { getLabel } from './getDropdownOptions';

export const getFieldMatched = (value, recordType) => {
  const isMarcRecord = recordType.toLowerCase().includes('marc');

  if (isMarcRecord) {
    return value;
  }

  const field = fieldsConfig.find(item => item.value === value);

  return field ? getLabel(field.label) : '';
};
