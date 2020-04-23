import React from 'react';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';

import { isEmpty } from 'lodash';

import * as validators from './formValidators';

export const getValidation = validation => validation.map(val => validators[val]);

export const augmentParam = (param, splitter, augment) => (param ? param.split(splitter).join(augment) : param);

export const isFormattedMessage = lbl => React.isValidElement(lbl);

export const isTranslationId = lbl => lbl && lbl.includes('ui-');

export const getOptionLabel = (options, label, sectionNamespace) => {
  const option = options.find(item => item.value === label);

  if (isEmpty(option)) {
    return undefined;
  }

  const isFMessage = isFormattedMessage(option.label);
  const isTranId = isTranslationId(option.label);

  if (isFMessage || (!isFMessage && !isTranId)) {
    return option.label;
  }

  const actualLabel = !isFMessage ? augmentParam(option.label, '**ns**', sectionNamespace) : option.label;

  return !isFormattedMessage ? <FormattedMessage id={actualLabel} /> : actualLabel;
};

export const checkDate = (dataType, value) => {
  const isDate = dataType === 'date';

  return isDate ? <FormattedDate value={value} /> : value;
};
