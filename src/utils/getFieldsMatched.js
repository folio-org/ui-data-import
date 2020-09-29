import { fieldsConfig } from './fieldsConfig';
import {
  HTML_LANG_DIRECTIONS,
  getCategory,
} from '.';

const getFieldFromResources = (fieldFromConfig, resources, fields) => {
  const {
    recordsName,
    fieldToSend,
    fieldToDisplay,
  } = fieldFromConfig.fromResources;

  const records = resources[recordsName]?.records || [];
  const fieldValue = fields[fields.length - 1].value;

  return records.find(record => record[fieldToSend] === fieldValue)?.[fieldToDisplay];
};

const getField = (fields, recordType, resources, intl) => {
  if (!fields.length || !recordType) {
    return undefined;
  }

  const fieldValue = fields.find(field => field.label === 'field')?.value;
  const fieldFromConfig = fieldsConfig.find(item => item.value === fieldValue);

  if (fieldFromConfig?.fromResources) {
    const fieldFromResources = getFieldFromResources(fieldFromConfig, resources, fields);
    const fieldLabel = fieldFromResources || undefined;

    return {
      fieldFromConfig,
      fieldLabel,
    };
  }

  const fieldLabel = fieldFromConfig ? intl.formatMessage({ id: fieldFromConfig.label }) : undefined;

  return {
    fieldFromConfig,
    fieldLabel,
  };
};

export const getFieldMatched = (fields, recordType, resources, intl) => {
  const isMarcRecord = recordType.toLowerCase().includes('marc');

  if (isMarcRecord) {
    const fieldsMatched = fields.map(item => (item ? item.value || '' : ''));

    if (document.dir === HTML_LANG_DIRECTIONS.RIGHT_TO_LEFT) {
      fieldsMatched.reverse();
    }

    return fieldsMatched.join('.');
  }

  const { fieldLabel } = getField(fields, recordType, resources, intl);

  return fieldLabel;
};

export const getFieldMatchedWithCategory = (fields, recordType, resources, intl) => {
  const {
    fieldFromConfig,
    fieldLabel,
  } = getField(fields, recordType, resources, intl);

  if (!fieldFromConfig) {
    return undefined;
  }

  const category = getCategory(fieldFromConfig);
  const categoryLabel = category ? intl.formatMessage({ id: category.label }) : '';

  return `${categoryLabel}: ${fieldLabel}`;
};
