import { get } from 'lodash';

import ordersTranslations from '@folio/orders/translations/ui-orders/en'; // eslint-disable-line import/no-unresolved
import inventoryTranslations from '@folio/inventory/translations/ui-inventory/en'; // eslint-disable-line import/no-unresolved
import invoiceTranslations from '@folio/invoice/translations/ui-invoice/en'; // eslint-disable-line import/no-unresolved
import { fieldsConfig } from './fields-config';
import { fieldCategoriesConfig } from './field-categories-config';

const translations = {
  ...ordersTranslations,
  ...inventoryTranslations,
  ...invoiceTranslations,
};

export const getLabel = key => translations[key];

export const matchFields = (resources, recordType) => {
  return fieldsConfig.filter(field => field.recordType
    && field.recordType === recordType
    && get(resources, field.id));
};

export const getCategoryId = field => fieldCategoriesConfig.find(category => category.id === field.categoryId);

export const getDropdownOptions = records => {
  return records.map(record => {
    const category = getCategoryId(record);

    return {
      value: record.value,
      label: `${getLabel(category.label)}: ${getLabel(record.label)}`,
    };
  });
};
