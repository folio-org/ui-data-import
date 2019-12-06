import { get } from 'lodash';

import ordersTranslations from '@folio/orders/translations/ui-orders/en';
import inventoryTranslations from '@folio/inventory/translations/ui-inventory/en';
import invoiceTranslations from '@folio/invoice/translations/ui-invoice/en';
import { fieldsConfig } from '../../test/bigtest/mocks/fields-config';
import { fieldCategoriesConfig } from '../../test/bigtest/mocks/field-categories-config';

const translations = {
  ...ordersTranslations,
  ...inventoryTranslations,
  ...invoiceTranslations,
};

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
      label: `${translations[category.label]}: ${translations[record.label]}`,
    };
  });
};
