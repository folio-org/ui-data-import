import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import { isEmpty } from 'lodash';

import { getTrimmedValue } from '.';

const REMOVE_OPTION_VALUE = '###REMOVE###';

/**
 * Validates field inputs
 *
 * @param {string|*} value
 * @return {undefined|JSX.Element} Validation message
 */
export const validateRequiredField = value => (
  !isEmpty(value) ? undefined : <FormattedMessage id="ui-data-import.validation.enterValue" />
);

/**
 * Validates Data Types from form inputs
 *
 * @param {string|*} value
 * @param {Object} formValues
 * @return {undefined|JSX.Element}
 */
export const validateDataTypes = (value, formValues) => {
  const { importBlocked } = formValues;

  if (importBlocked) {
    return undefined;
  }

  return validateRequiredField(value);
};

/**
 * Validates file extensions from form input
 *
 * @param {string|*} value
 * @return {undefined|JSX.Element}
 */
export const validateFileExtension = value => {
  const pattern = /^\.(\w+)$/;

  if (value.match(pattern)) {
    return undefined;
  }

  return <FormattedMessage id="ui-data-import.validation.fileExtension" />;
};

/**
 * Validate an alphanumeric or allowed input value
 *
 * @param {string|*} value
 * @param {string?} allowedValue
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateAlphanumericOrAllowedValue('value')
 * // => undefined
 *
 * validateAlphanumericOrAllowedValue('123')
 * // => undefined
 *
 * validateAlphanumericOrAllowedValue('*', '*')
 * // => undefined
 *
 * validateAlphanumericOrAllowedValue('*')
 * // => Translated string (en = 'Please enter an alphanumeric value')
 */
export const validateAlphanumericOrAllowedValue = (value, allowedValue) => {
  const pattern = /^[a-zA-Z0-9]*$/;
  const val = getTrimmedValue(value);

  if (isEmpty(val) || val === allowedValue || val.match(pattern)) {
    return undefined;
  }

  return <FormattedMessage id="ui-data-import.validation.valueType" />;
};

/**
 * Validate a max length of the input value
 *
 * @param {string|*} value
 * @param {number} maxLength
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateValueLength('value', 5)
 * // => undefined
 *
 * validateValueLength('value', 1)
 * // => Translated string (en = 'Invalid value. Maximum 1 character(s) allowed')
 */
export const validateValueLength = (value, maxLength) => {
  const val = getTrimmedValue(value);

  if (!val || !val.length || val.length <= maxLength) {
    return undefined;
  }

  return (
    <FormattedMessage
      id="ui-data-import.validation.maxLength"
      values={{ maxLength }}
    />
  );
};

/**
 * Validate the input value length equals 1 character
 *
 * @param {string|*} value
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateValueLength1('a')
 * // => undefined
 *
 * validateValueLength1('value')
 * // => Translated string (en = 'Invalid value. Maximum 1 character(s) allowed')
 */
export const validateValueLength1 = value => validateValueLength(value, 1);

/**
 * Validate the input value length equals 3 characters
 *
 * @param {string|*} value
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateValueLength3('abs')
 * // => undefined
 *
 * validateValueLength3('value')
 * // => Translated string (en = 'Invalid value. Maximum 3 character(s) allowed')
 */
export const validateValueLength3 = value => validateValueLength(value, 3);

/**
 * Validate MARC path, quoted string and else condition. Match `910`, `910$a`, `"text"`, `LDR`, `LDR/7`, `005/7-10`,
 * `910$a "text"`, `910$a; else "text"; else 910`,
 * @param value
 * @param {boolean} isRemoveValueAllowed
 * @returns {boolean}
 *
 * @example
 * validateQuotedStringOrMarcPathPattern('###REMOVE###', true)
 * // => true
 *
 * validateQuotedStringOrMarcPathPattern('TEST', false)
 * // => false
 */
const validateQuotedStringOrMarcPathPattern = (value, isRemoveValueAllowed) => {
  const allowedValue = isRemoveValueAllowed ? REMOVE_OPTION_VALUE : '';
  const quotedStringOrMarcPathPattern = '(("[^"]+")|((005|006|007|008|LDR)[\\w\\/\\-]*)|([0-9]{3}(\\$[a-z0-9])?))';

  const pattern = new RegExp([
    `^${quotedStringOrMarcPathPattern}`,
    `(((\\s(?=${quotedStringOrMarcPathPattern}))`,
    `((?<=\\s)${quotedStringOrMarcPathPattern}))|`,
    `(((; else )(?=${quotedStringOrMarcPathPattern}))`,
    `((?<=(; else ))${quotedStringOrMarcPathPattern})))*$`].join(''));

  return isEmpty(value) || value === allowedValue || value.match(pattern);
};

/**
 * Validate MARC path, quoted string and else condition. Match `910`, `910$a`, `"text"`, `LDR`, `LDR/7`, `005/7-10`,
 * `910$a "text"`, `910$a; else "text"; else 910`,
 * @param value
 * @param {boolean} isRemoveValueAllowed
 * @returns {undefined|JSX.Element}
 *
 * @example
 * validateMARCWithElse('###REMOVE###', true)
 * // => undefined
 *
 * validateMARCWithElse('###REMOVE###', false)
 * // => Translated string (en = 'Please correct the syntax to continue')
 */
export const validateMARCWithElse = (value, isRemoveValueAllowed) => {
  const isValid = validateQuotedStringOrMarcPathPattern(value, isRemoveValueAllowed);

  return isValid ? undefined : <FormattedMessage id="ui-data-import.validation.syntaxError" />;
};

/**
 * Validate MARC path, quoted string and else condition. Match `910`, `910$a`, `"text"`, `LDR`, `LDR/7`, `005/7-10`,
 * `910$a "text"`, `910$a; else "text"; else 910`,
 * @param value
 * @param {boolean} isRemoveValueAllowed
 * @returns {undefined|JSX.Element}
 *
 * @example
 * validateQuotedStringOrMarcPath('###REMOVE###', true)
 * // => undefined
 *
 * validateQuotedStringOrMarcPath('###REMOVE###', false)
 * // => Translated string (en = 'Non-MARC value must use quotation marks')
 */
export const validateQuotedStringOrMarcPath = (value, isRemoveValueAllowed) => {
  const isValid = validateQuotedStringOrMarcPathPattern(value, isRemoveValueAllowed);

  return isValid ? undefined : <FormattedMessage id="ui-data-import.validation.quotationError" />;
};

/**
 * Validate MARC path, quoted date, `today` constant and else condition. Match `910`, `910$a`, `###TODAY###`,
 * `"2020-01-01"`, `910$a "2020-01-01"`, `910$a; else ###TODAY###; else "2020-01-01"`,
 *
 * @param value
 * @param {boolean?} isRemoveValueProhibited
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateMARCWithDate('###REMOVE###', false)
 * // => undefined
 */
export const validateMARCWithDate = (value, isRemoveValueProhibited) => {
  const allowedValue = isRemoveValueProhibited ? '' : REMOVE_OPTION_VALUE;
  const todayOrDatePattern = '((###TODAY###)|("\\d{4}-\\d{2}-\\d{2}")|([0-9]{3}(\\$[a-z0-9])?))';
  const pattern = new RegExp([
    `^${todayOrDatePattern}`,
    `(((\\s(?=${todayOrDatePattern}))`,
    `((?<=\\s)${todayOrDatePattern}))|`,
    `(((; else )(?=${todayOrDatePattern}))`,
    `((?<=(; else ))${todayOrDatePattern})))*$`].join(''));

  if (isEmpty(value) || value === allowedValue) {
    return undefined;
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

    return undefined;
  }

  return <FormattedMessage id="ui-data-import.validation.syntaxError" />;
};

/**
 * Validate repeatable action field value
 *
 * @param {string|*} value
 * @param {boolean} hasFields
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateRepeatableActionsField('Add these to existing', true)
 * // => undefined
 *
 * validateRepeatableActionsField('Add these to existing', false)
 * // => Translated string (en = 'One or more values must be added before the profile can be saved.')
 *
 * validateRepeatableActionsField('', true)
 * // => Translated string (en = 'Action must be selected before the profile can be saved')
 */
export const validateRepeatableActionsField = (value, hasFields) => {
  const val = getTrimmedValue(value);

  if (!isEmpty(val) && !hasFields) {
    return <FormattedMessage id="ui-data-import.validation.chooseAtLeastOneValue" />;
  }

  if (isEmpty(val) && hasFields) {
    return <FormattedMessage id="ui-data-import.validation.selectAnAction" />;
  }

  return undefined;
};

/**
 * Validate input field with accepted values
 *
 * @param {Array<Object>} acceptedValues
 * @param {string} valueKey
 * @returns {function(*=): (undefined|JSX.Element)}
 *
 * @example
 *
 * validateAcceptedValues([{ key: 'value' }], 'key')('"value"')
 * // => undefined
 *
 * validateAcceptedValues([{ key: 'value' }], 'key')('"test"')
 * // => Translated string (en = 'Please correct the syntax to continue')
 */
export const validateAcceptedValues = (acceptedValues, valueKey) => value => {
  const pattern = /"[^"]+"/g;

  if (!value || !value.length || !acceptedValues.length) {
    return undefined;
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

  return undefined;
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
 * // => undefined
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

  return undefined;
};

/**
 * Validate MARC Indicator input value
 *
 * @param {string|*} field
 * @param {string|*} indicator1
 * @param {string|*} indicator2
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateMarcIndicatorField('910', 'a', 'a')
 * // => undefined
 *
 * validateMarcIndicatorField('999', 'f', 'f')
 * // => Translated string (en = 'This field cannot be updated')
 */
export const validateMarcIndicatorField = (field, indicator1, indicator2) => {
  if (field === '999' && indicator1 === 'f' && indicator2 === 'f') {
    return <FormattedMessage id="ui-data-import.validation.cannotBeUpdated" />;
  }

  return undefined;
};

/**
 * Validate MARC Field input value for Match Criterion
 *
 * @param {string|*} indicator1
 * @param {string|*} indicator2
 * @param {string|*} subfield
 * @returns {undefined|JSX.Element}
 *
 * @example
 *
 * validateMarcFieldInMatchCriterion('011')
 * // => undefined
 *
 * validateMarcFieldInMatchCriterion('002')
 * // => Translated string (en = 'This field cannot be updated')
 */
export const validateMARCFieldInMatchCriterion = (indicator1, indicator2, subfield) => {
  if (!isEmpty(indicator1) || !isEmpty(indicator2) || !isEmpty(subfield)) {
    return <FormattedMessage id="ui-data-import.validation.cannotBeUpdated" />;
  }

  return undefined;
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
 * // => undefined
 *
 * validateSubfieldField('006')('')
 * // => undefined
 *
 * validateSubfieldField('910')('')
 * // => Translated string (en = 'Please enter a value')
 */
export const validateSubfieldField = field => value => {
  if ((field !== '006' && field !== '007' && field !== '008') && isEmpty(value)) {
    return <FormattedMessage id="ui-data-import.validation.enterValue" />;
  }

  return undefined;
};

/**
 * Validate field to move
 *
 * @param {string|*} field
 * @returns {function(...[*]=)}
 *
 * @example
 *
 * validateMoveField('900')('910')
 * // => undefined
 *
 * validateMoveField('900')('900')
 * // => Translated string (en = 'Please choose a different field')
 */
export const validateMoveField = field => fieldToMove => {
  if (field === fieldToMove) {
    return <FormattedMessage id="ui-data-import.validation.chooseDifferentField" />;
  }

  return undefined;
};

/**
 * Validate quoted string
 *
 * @param {string|*} value
 * @returns {JSX.Element|undefined}
 *
 * @example
 *
 * validateQuotedString('"test"')
 * // => undefined
 *
 * validateQuotedString('test')
 * // => Translated string (en = 'Please correct the syntax to continue')
 */
export const validateQuotedString = value => {
  if (!value || !value.length) {
    return undefined;
  }

  const pattern = /^"[^"]+"$/;

  if (value.match(pattern)) {
    return undefined;
  }

  return <FormattedMessage id="ui-data-import.validation.syntaxError" />;
};

/**
 * Validate the whole numbers greater than 0 and less than 1000 wrapped in
 * the quotation marks
 *
 * @param value
 * @returns {JSX.Element|undefined}
 *
 * @example
 *
 * validateIntegers("999")
 * // => undefined
 *
 * validateIntegers(999)
 * // => Translated string (en = 'Non-MARC value must use quotation marks')
 *
 * validateIntegers("2.5")
 * // => Translated string (en = 'Please enter a whole number greater than 0 and less than 1000 to continue')
 *
 * validateIntegers("text")
 * // => Translated string (en = 'Please enter a whole number greater than 0 and less than 1000 to continue')
 *
 * validateIntegers("0")
 * // => Translated string (en = 'Please enter a whole number greater than 0 and less than 1000 to continue')
 *
 * validateIntegers("1000")
 * // => Translated string (en = 'Please enter a whole number greater than 0 and less than 1000 to continue')
 */
export const validateIntegers = value => {
  if (!value || !value.length) {
    return undefined;
  }

  if ((value.charAt(0) !== '"') || (value.charAt(value.length - 1) !== '"')) {
    return <FormattedMessage id="ui-data-import.validation.quotationError" />;
  }

  const pattern = /^"([1-9]\d{0,2})"$/;

  if (!value.match(pattern)) {
    return <FormattedMessage id="ui-data-import.validation.integer" />;
  }

  return undefined;
};
