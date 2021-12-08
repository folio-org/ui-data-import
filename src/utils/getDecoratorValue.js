import React from 'react';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  BOOLEAN_ACTIONS,
  ENTITY_KEYS,
  FORMS_SETTINGS,
  isFormattedMessage,
  isTranslationId,
} from '.';

export const getDecoratorValue = value => {
  const booleanActions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'BOOLEAN_ACTIONS'], []);
  const actionLabel = booleanActions.find(item => item.value === value)?.label;

  if (value === BOOLEAN_ACTIONS.AS_IS) {
    return '';
  }

  if (actionLabel) {
    if (!isFormattedMessage(actionLabel) && isTranslationId(actionLabel)) {
      return <FormattedMessage id={actionLabel} />;
    }

    return actionLabel;
  }

  return value;
};
