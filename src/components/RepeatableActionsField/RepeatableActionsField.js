import React, { memo } from 'react';
import { PropTypes } from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { Field } from 'redux-form';
import { get } from 'lodash';

import {
  Select,
  Headline,
} from '@folio/stripes/components';

import {
  ENTITY_KEYS,
  FORMS_SETTINGS,
  isFormattedMessage,
  isTranslationId,
} from '../../utils';

import styles from './RepeatableActionsField.css';

export const RepeatableActionsFieldComponent = memo(({
  wrapperFieldName,
  legend,
  wrapperPlaceholder,
  children,
  disabled,
  intl,
}) => {
  const actions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'REPEATABLE_ACTIONS'], []);
  const dataOptions = Object.keys(actions).map(key => ({
    value: key,
    label: intl.formatMessage({ id: actions[key] }),
  }));

  const needsTranslation = wrapperPlaceholder && !isFormattedMessage(wrapperPlaceholder) && isTranslationId(wrapperPlaceholder);

  const legendHeadline = (
    <Headline
      tag="h3"
      margin="xx-small"
    >
      {legend}
    </Headline>
  );

  return (
    <div className={styles.decorator}>
      {legend && legendHeadline}
      <div
        data-test-repeatable-decorator
        className={styles.repeatableActions}
      >
        {needsTranslation ? (
          <FormattedMessage id={wrapperPlaceholder}>
            {placeholder => (
              <Field
                name={wrapperFieldName}
                component={Select}
                dataOptions={dataOptions}
                placeholder={placeholder}
                disabled={disabled}
              />
            )}
          </FormattedMessage>
        ) : (
          <Field
            name={wrapperFieldName}
            component={Select}
            dataOptions={dataOptions}
            placeholder={wrapperPlaceholder}
            disabled={disabled}
          />
        )}
      </div>
      {children}
    </div>
  );
});

RepeatableActionsFieldComponent.propTypes = {
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  wrapperFieldName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  wrapperPlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

RepeatableActionsFieldComponent.defaultProps = {
  disabled: false,
  wrapperPlaceholder: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions',
};

export const RepeatableActionsField = injectIntl(RepeatableActionsFieldComponent);
