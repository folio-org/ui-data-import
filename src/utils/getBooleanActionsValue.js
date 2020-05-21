import React from 'react';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  ENTITY_KEYS,
  FORMS_SETTINGS,
  isFormattedMessage,
  isTranslationId,
} from '.';

export const getBooleanActionsValue = value => {
  const actions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'BOOLEAN_ACTIONS'], []);
  const newValue = actions.OPTIONS.find(item => item.value === value)?.label;

  if (value === actions.DEFAULT_OPTION) {
    return '';
  }

  if (newValue) {
    if (!isFormattedMessage(newValue) && isTranslationId(newValue)) {
      return <FormattedMessage id={newValue} />;
    }

    return newValue;
  }

  return value;
};
