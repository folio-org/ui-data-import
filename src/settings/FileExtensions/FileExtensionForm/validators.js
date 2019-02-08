import React from 'react';
import { FormattedMessage } from 'react-intl';

import { isRequiredFieldValid } from '../../../utils/formValidators';

const validateRequiredField = value => {
  const requiredFieldValid = isRequiredFieldValid(value);

  if (requiredFieldValid) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.enterValue" />;
};

const validateDataTypes = (value, formValues) => {
  const { importBlocked } = formValues;

  if (importBlocked) {
    return null;
  }

  return validateRequiredField(value);
};

const validateFileExtension = value => {
  const pattern = /^\.(\w+)$/;

  if (value.match(pattern)) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.fileExtension" />;
};

const validators = {
  fileExtension: [validateRequiredField, validateFileExtension],
  dataTypes: [validateDataTypes],
};

export default validators;
