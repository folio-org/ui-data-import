import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  get,
  isEmpty,
} from 'lodash';

import {
  Checkbox,
  InfoPopover,
  NoValue,
} from '@folio/stripes/components';
import { CurrencySymbol } from '@folio/stripes-acq-components';

import { ProhibitionIcon } from '../../../components';

import {
  FIELD_NAME_PREFIX,
  TRANSLATION_ID_PREFIX,
  UUID_IN_QUOTES_PATTERN,
} from './constants';
import {
  BOOLEAN_ACTIONS,
  ENTITY_KEYS,
  FORMS_SETTINGS,
  REPEATABLE_ACTIONS,
} from '../../../utils';

export const getFieldEnabled = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].enabled`;
};

export const getFieldName = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].value`;
};

export const getRepeatableFieldName = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].repeatableFieldAction`;
};

export const getBoolFieldName = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].booleanFieldAction`;
};

export const getSubfieldName = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields.${subfieldIndex}.fields.${fieldIndex}.value`;
};

export const getInnerSubfieldName = (mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, innerFieldIndex, innerSubfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields.${mappingSubfieldIndex}.fields.${mappingSubfieldFieldIndex}.subfields.${innerSubfieldIndex}.fields.${innerFieldIndex}.value`;
};

export const getBoolSubfieldName = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].booleanFieldAction`;
};

export const getAcceptedValuesPath = mappingFieldIndex => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].acceptedValues`;
};

export const getRepeatableAcceptedValuesPath = (mappingFieldIndex, fieldIndex, subfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].acceptedValues`;
};

export const getInnerRepeatableAcceptedValuesPath = (mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, innerFieldIndex, innerSubfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${mappingSubfieldIndex}].fields[${mappingSubfieldFieldIndex}].subfields[${innerSubfieldIndex}].fields[${innerFieldIndex}].acceptedValues`;
};

export const getInnerSubfieldsPath = (mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${mappingSubfieldIndex}].fields[${mappingSubfieldFieldIndex}].subfields`;
};

export const getInnerBooleanFieldPath = (mappingFieldIndex, subfieldIndex, fieldIndex, innerFieldIndex, innerSubfieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${subfieldIndex}].fields[${fieldIndex}].subfields[${innerSubfieldIndex}].fields[${innerFieldIndex}].booleanFieldAction`;
};

export const getInnerRepeatableFieldPath = (mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex) => {
  return `${FIELD_NAME_PREFIX}[${mappingFieldIndex}].subfields[${mappingSubfieldIndex}].fields[${mappingSubfieldFieldIndex}].repeatableFieldAction`;
};

export const handleRepeatableFieldAndActionAdd = (repeatableFieldActionPath, fieldsToAddPath, refTable, setReferenceTables, isFirstSubfield) => {
  setReferenceTables(fieldsToAddPath, refTable);

  if (isFirstSubfield) {
    setReferenceTables(repeatableFieldActionPath, REPEATABLE_ACTIONS.EXTEND_EXISTING);
  }
};
export const handleRepeatableFieldAndActionClean = (repeatableFieldActionPath, fieldsToAddPath, refTable, setReferenceTables, isLastSubfield) => {
  setReferenceTables(fieldsToAddPath, refTable);

  if (isLastSubfield) {
    setReferenceTables(repeatableFieldActionPath, null);
  }
};

export const onAdd = (refTable, fieldName, fieldIndex, initialFields, callback, incrementalField, getPath) => {
  const newRefTable = [...refTable];
  const fieldsPath = getPath ? getPath(fieldIndex) : `profile.mappingDetails.mappingFields[${fieldIndex}].subfields`;
  let newInitRow = { ...get(initialFields, fieldName) };
  const isFirstSubfield = isEmpty(refTable);

  if (incrementalField) {
    newInitRow = {
      ...newInitRow,
      [incrementalField]: refTable.length,
    };
  }

  newRefTable.push(newInitRow);
  callback(fieldsPath, newRefTable, fieldIndex, isFirstSubfield);
};

export const onRemove = (index, refTable, fieldIndex, callback, incrementalField, getPath, getRepeatableActionFieldPath) => {
  const fieldsPath = getPath ? getPath(fieldIndex) : `profile.mappingDetails.mappingFields[${fieldIndex}].subfields`;
  let newRefTable = [...refTable];

  newRefTable.splice(index, 1);

  if (incrementalField) {
    newRefTable = newRefTable.map((row, i) => ({
      ...row,
      [incrementalField]: i,
    }));
  }

  const isLastSubfield = newRefTable.length === 0;

  if (isLastSubfield) {
    const repeatableActionFieldPath = getRepeatableActionFieldPath
      ? getRepeatableActionFieldPath(fieldIndex)
      : getRepeatableFieldName(fieldIndex);

    callback(repeatableActionFieldPath, null, fieldIndex, isLastSubfield);
  }

  callback(fieldsPath, newRefTable, fieldIndex, isLastSubfield);
};

export const getFieldValue = (details, fieldName, key) => details.find(item => item?.name === fieldName)?.[key];

export const getFieldValueByPath = (details, path, key) => details.find(item => item.path === path)?.[key];

export const getValueById = id => (id ? <FormattedMessage id={id} /> : <NoValue />);

export const getUnmappableValueById = (id, fieldName) => (id ? <FormattedMessage id={id} /> : <ProhibitionIcon fieldName={fieldName} />);

export const transformSubfieldsData = (subfields, columns) => subfields?.map(item => {
  return columns.reduce((acc, column) => {
    const fieldValue = item?.fields.find(field => field?.name === column.field)?.[column.key];

    return {
      ...acc,
      [column.field]: fieldValue,
    };
  }, {});
});

export const getContentData = fields => (!isEmpty(fields) ? fields : [{}]);

export const getBooleanLabelId = fieldValue => {
  const booleanActions = FORMS_SETTINGS[ENTITY_KEYS.MAPPING_PROFILES].DECORATORS.BOOLEAN_ACTIONS;

  return booleanActions.find(action => action.value === fieldValue)?.label;
};

export const updateInitialFields = initials => {
  const newInitRow = { ...initials };
  const updatedInitRow = {};

  Object.keys(newInitRow).forEach(key => {
    const fieldToUpdate = newInitRow[key];

    const updatedFields = fieldToUpdate.fields.map(field => {
      return {
        ...field,
        subfields: [],
      };
    });

    updatedInitRow[key] = {
      ...fieldToUpdate,
      fields: updatedFields,
    };
  });

  return updatedInitRow;
};

export const getRefValuesFromTables = (referenceTables, fieldPath) => get(referenceTables, fieldPath, []);

export const getFieldValueFromDetails = (path, fieldName, trimQuotes = true) => {
  const value = path?.find(item => (item?.name === fieldName))?.value;

  if (trimQuotes) {
    return value?.replace(/['"]+/g, '');
  }

  return value;
};

export const getBoolFieldValueFromDetails = (path, fieldName) => {
  return path?.find(item => (item?.name === fieldName))?.booleanFieldAction;
};

export const getAccountingCodeOptions = vendor => {
  const accounts = get(vendor, 'accounts', []).filter(({ appSystemNo }) => Boolean(appSystemNo));
  const options = accounts.map(({
    accountNo,
    appSystemNo,
  }) => ({
    label: `${accountNo} (${appSystemNo})`,
    value: appSystemNo,
  }));
  const erpCode = get(vendor, 'erpCode');
  const defaultOption = erpCode
    ? [{
      label: `Default (${erpCode})`,
      value: erpCode,
    }]
    : [];

  return [
    ...defaultOption,
    ...options,
  ];
};

export const getAccountingNumberOptions = vendor => {
  const accounts = get(vendor, 'accounts', []).filter(({ accountNo }) => Boolean(accountNo));

  return accounts.map(({ accountNo }) => ({
    label: accountNo,
    value: accountNo,
  }));
};

export const getAccountNumbersByCode = organization => {
  return organization.accounts.reduce((obj, account) => (!account.appSystemNo ? obj : {
    ...obj,
    [account.appSystemNo]: account.accountNo,
  }), {});
};

export const PERCENTAGE_VALUE = 'percentage';

export const renderAmountValue = (amountValue, amountType, currency) => {
  const amountSymbol = amountType?.toLowerCase() === `"${PERCENTAGE_VALUE}"` ?
    <FormattedMessage id="stripes-acq-components.fundDistribution.type.sign.percent" /> :
    <CurrencySymbol currency={currency} />;

  return <> {amountValue}{amountSymbol} </>;
};

export const renderCheckbox = (labelPathId, fieldValue) => (
  <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.${labelPathId}`}>
    {([ariaLabel]) => (
      <Checkbox
        checked={fieldValue === BOOLEAN_ACTIONS.ALL_TRUE}
        aria-label={ariaLabel}
        disabled
      />
    )}
  </FormattedMessage>
);

export const boolAcceptedValuesOptions = formatMessage => ([
  {
    label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.true` }),
    value: 'true',
  }, {
    label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.false` }),
    value: 'false',
  },
]);

export const renderFieldLabelWithInfo = (fieldLabelId, infoMessageId) => (
  <>
    <FormattedMessage id={fieldLabelId} />
    <InfoPopover
      iconSize="medium"
      content={<FormattedMessage id={infoMessageId} />}
    />
  </>
);

export const getMatchByUuidInQuotes = valueFromDetails => {
  const idMatch = valueFromDetails?.match(UUID_IN_QUOTES_PATTERN);

  return idMatch ? idMatch[1] : null;
};

export const getMappingQueryFromValue = valueFromDetails => {
  const mappingEndPosition = valueFromDetails?.indexOf('"');

  return valueFromDetails?.substring(0, mappingEndPosition === -1 ? valueFromDetails.length : mappingEndPosition);
};

export const clearFieldValue = ({ paths, setReferenceTables, isSubfield = false, isCheckbox = false }) => {
  const checkSubfieldInitialValue = isSubfield ? [] : '';
  const initialValue = isCheckbox ? BOOLEAN_ACTIONS.ALL_FALSE : checkSubfieldInitialValue;

  if (isSubfield) {
    paths.forEach(path => {
      setReferenceTables(`${path}.subfields`, initialValue);
      setReferenceTables(`${path}.repeatableFieldAction`, '');
    });
  } else {
    paths.forEach(path => setReferenceTables(path, initialValue));
  }
};

export const clearSubfieldValue = ({
  mappingFieldIndex,
  setReferenceTables,
  subfields,
  subfieldName,
}) => {
  subfields.forEach((item, subfieldIndex) => {
    const fieldIndex = item.fields.findIndex(field => field.name === subfieldName);
    setReferenceTables(getSubfieldName(mappingFieldIndex, fieldIndex, subfieldIndex), '');
  });
};
