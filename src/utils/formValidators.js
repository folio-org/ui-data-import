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

/**
 * Validate an alphanumeric or allowed input value
 *
 * @param {string|*} value
 * @param {string?} allowedValue
 * @returns {null|*}
 *
 * @example
 *
 * validateAlphanumericOrAllowedValue('value')
 * // => null
 *
 * validateAlphanumericOrAllowedValue('123')
 * // => null
 *
 * validateAlphanumericOrAllowedValue('*', '*')
 * // => null
 *
 * validateAlphanumericOrAllowedValue('*')
 * // => Translated string (en = 'Please enter an alphanumeric value')
 */
export const validateAlphanumericOrAllowedValue = (value, allowedValue) => {
  const pattern = /^[a-zA-Z0-9]*$/;
  const val = value && value.trim ? value.trim() : value;

  if (isEmpty(val) || val === allowedValue || val.match(pattern)) {
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

export const validateAcceptedValues = (acceptedValues, valueKey) => value => {
  const pattern = /"[^"]+"/g;

  if (!value || !value.length || !acceptedValues.length) {
    return null;
  }

  const matches = value.match(pattern);

  if (matches) {
    for (const str of matches) {
      const croppedStr = str.slice(1, -1);

      const isValid = acceptedValues.some(option => option[valueKey] === croppedStr);

      if (!isValid) {
        return <FormattedMessage id="ui-data-import.validation.syntaxError" />;
      }
    }
  }

  return null;
};

/**
 * Validate MARC Field input value
 *
 * @param {string|*} indicator1
 * @param {string|*} indicator2
 * @returns {function(...[*]=)}
 *
 * @example
 *
 * validateMarcTagField('', '')('910')
 * // => null
 *
 * validateMarcTagField('', '')('001')
 * // => Translated string (en = 'This field cannot be updated')
 *
 * validateMarcTagField('', '')('005')
 * // => Translated string (en = 'This field cannot be updated')
 *
 * validateMarcTagField('f', 'f')('999')
 * // => Translated string (en = 'This field cannot be updated')
 */
export const validateMarcTagField = (indicator1, indicator2) => value => {
  if (value === '001' || value === '005' || (value === '999' && indicator1 === 'f' && indicator2 === 'f')) {
    return <FormattedMessage id="ui-data-import.validation.cannotBeUpdated" />;
  }

  return null;
};

/**
 * Validate MARC Indicator input value
 *
 * @param {string|*} field
 * @param {string|*} indicator1
 * @param {string|*} indicator2
 * @returns {null|*}
 *
 * @example
 *
 * validateMarcIndicatorField('910', 'a', 'a')
 * // => null
 *
 * validateMarcIndicatorField('999', 'f', 'f')
 * // => Translated string (en = 'This field cannot be updated')
 */
export const validateMarcIndicatorField = (field, indicator1, indicator2) => {
  if (field === '999' && indicator1 === 'f' && indicator2 === 'f') {
    return <FormattedMessage id="ui-data-import.validation.cannotBeUpdated" />;
  }

  return null;
};

/**
 * Validate MARC Subfield input value
 *
 * @param {string|*} field
 * @returns {function(...[*]=)}
 *
 * @example
 *
 * validateSubfieldField('910')('a')
 * // => null
 *
 * validateSubfieldField('006')('')
 * // => null
 *
 * validateSubfieldField('910')('')
 * // => Translated string (en = 'Please enter a value')
 */
export const validateSubfieldField = field => value => {
  if ((field !== '006' && field !== '007' && field !== '008') && isEmpty(value)) {
    return <FormattedMessage id="ui-data-import.validation.enterValue" />;
  }

  return null;
};
