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
