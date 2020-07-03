import { get } from 'lodash';

import { fieldsConfig } from './fields-config';
import { fieldCategoriesConfig } from './field-categories-config';

export const matchFields = (resources, recordType) => {
  return fieldsConfig.filter(field => field.recordType
    && field.recordType === recordType
    && get(resources, field.id));
};

export const getCategoryId = field => fieldCategoriesConfig.find(category => category.id === field.categoryId);

export const getDropdownOptions = (records, intl) => {
  return records.map(record => {
    const category = getCategoryId(record);

    const categoryValue = intl.formatMessage({ id: category.label });
    const labelValue = intl.formatMessage({ id: record.label });

    return {
      value: record.value,
      label: `${categoryValue}: ${labelValue}`,
    };
  });
};
