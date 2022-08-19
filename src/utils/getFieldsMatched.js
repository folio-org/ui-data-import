import {
  HTML_LANG_DIRECTIONS,
  MARC_FIELD_CONSTITUENT,
  fieldsConfig,
  fieldCategoriesConfig,
} from '.';

const getFieldFromResources = (fieldFromConfig, resources, fields) => {
  const {
    recordsName,
    fieldToSend,
    fieldToDisplay,
  } = fieldFromConfig.fromResources;

  const records = resources?.[recordsName]?.records || [];
  const fieldValue = fields[fields.length - 1].value;

  return records.find(record => record[fieldToSend] === fieldValue)?.[fieldToDisplay];
};

const getField = (fields, recordType, resources, formatMessage) => {
  if (!fields.length || !recordType) {
    return undefined;
  }

  const fieldValue = fields.find(field => field.label === MARC_FIELD_CONSTITUENT.FIELD)?.value;
  const fieldFromConfig = fieldsConfig.find(item => item.value === fieldValue);

  if (fieldFromConfig?.fromResources) {
    const fieldFromResources = getFieldFromResources(fieldFromConfig, resources, fields);

    return {
      fieldFromConfig,
      fieldLabel: fieldFromResources || undefined,
    };
  }

  const fieldLabel = fieldFromConfig ? formatMessage({ id: fieldFromConfig.label }) : undefined;

  return {
    fieldFromConfig,
    fieldLabel,
  };
};

export const getFieldMatched = (fields, recordType, formatMessage, resources) => {
  const isMarcRecord = recordType.toLowerCase().includes('marc');

  if (isMarcRecord) {
    const fieldsMatched = fields.map(item => item.value || '');

    if (document.dir === HTML_LANG_DIRECTIONS.RIGHT_TO_LEFT) {
      fieldsMatched.reverse();
    }

    return fieldsMatched.join('.');
  }

  const { fieldLabel } = getField(fields, recordType, resources, formatMessage);

  return fieldLabel;
};
