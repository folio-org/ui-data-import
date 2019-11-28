import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

/**
 * Validates field inputs
 *
 * @param {string|*} value
 * @return {null|*} Validation message
 */
export const validateRequiredField = value => {
  const isValid = !isEmpty(value);

  if (isValid) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.enterValue" />;
};

/**
 * Validates Data Types from form inputs
 *
 * @param {string|*} value
 * @param {Object} formValues
 * @return {null|*}
 */
export const validateDataTypes = (value, formValues) => {
  const { importBlocked } = formValues;

  if (importBlocked) {
    return null;
  }

  return validateRequiredField(value);
};

/**
 * Validates file extensions from form input
 *
 * @param {string|*} value
 * @return {null|*}
 */
export const validateFileExtension = value => {
  const pattern = /^\.(\w+)$/;

  if (value.match(pattern)) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.fileExtension" />;
};

export const validateValueType = value => {
  const pattern = /^[a-zA-Z0-9]*$/;

  if (!value || value.match(pattern)) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.valueType" />;
};

export const validateValueLength = (value, maxLength) => {
  if (!value || value.length <= maxLength) {
    return null;
  }

  return (
    <FormattedMessage
      id="ui-data-import.validation.maxLength"
      values={{ maxLength }}
    />
  );
};

export const validateValueLength1 = value => validateValueLength(value, 1);

export const validateValueLength3 = value => validateValueLength(value, 3);
