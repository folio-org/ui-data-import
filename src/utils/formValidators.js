import React from 'react';
import moment from 'moment';
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
  const val = value && value.trim ? value.trim() : value;

  if (!val || !val.length || val.match(pattern)) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.valueType" />;
};

export const validateValueLength = (value, maxLength) => {
  const val = value && value.trim ? value.trim() : value;

  if (!val || !val.length || val.length <= maxLength) {
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

/**
 * Validate MARC path, quoted string and else condition. Match `910`, `910$a`, `"text"`,
 * `910$a "text"`, `910$a; else "text"; else 910`,
 * @param value
 * @returns {null|*}
 */
export const validateMARCWithElse = value => {
  const quotedStringOrMarcPathPattern = '(("[^"]+")|([0-9]{3}(\\$[a-z])?))';
  const pattern = new RegExp([
    `^${quotedStringOrMarcPathPattern}`,
    `(((\\s(?=${quotedStringOrMarcPathPattern}))`,
    `((?<=\\s)${quotedStringOrMarcPathPattern}))|`,
    `(((; else )(?=${quotedStringOrMarcPathPattern}))`,
    `((?<=(; else ))${quotedStringOrMarcPathPattern})))*$`].join(''));

  if (!value || !value.length || value.match(pattern)) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.syntaxError" />;
};

/**
 * Validate MARC path, quoted date, `today` constant and else condition. Match `910`, `910$a`, `###TODAY###`,
 * `"2020-01-01"`, `910$a "2020-01-01"`, `910$a; else ###TODAY###; else "2020-01-01"`,
 * @param value
 * @returns {null|*}
 */
export const validateMARCWithDate = value => {
  const todayOrDatePattern = '((###TODAY###)|("\\d{4}-\\d{2}-\\d{2}")|([0-9]{3}(\\$[a-z])?))';
  const pattern = new RegExp([
    `^${todayOrDatePattern}`,
    `(((\\s(?=${todayOrDatePattern}))`,
    `((?<=\\s)${todayOrDatePattern}))|`,
    `(((; else )(?=${todayOrDatePattern}))`,
    `((?<=(; else ))${todayOrDatePattern})))*$`].join(''));

  if (!value || !value.length) {
    return null;
  }

  if (value.match(pattern)) {
    const datePattern = /\d{4}-\d{2}-\d{2}/g;
    const dates = value.match(datePattern);

    if (dates) {
      const DATE_FORMAT = 'YYYY-MM-DD';
      const isValidDate = dates.every(date => moment(date, DATE_FORMAT, true).isValid());

      if (!isValidDate) {
        return <FormattedMessage id="ui-data-import.validation.syntaxError" />;
      }
    }

    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.syntaxError" />;
};
