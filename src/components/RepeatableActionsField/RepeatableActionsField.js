import React, { memo } from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';

import {
  Select,
  Headline,
} from '@folio/stripes/components';

import { WithTranslation } from '..';

import {
  ENTITY_KEYS,
  FORMS_SETTINGS,
} from '../../utils';

import styles from './RepeatableActionsField.css';

export const RepeatableActionsField = memo(({
  wrapperFieldName,
  legend,
  wrapperPlaceholder,
  children,
  disabled,
}) => {
  const intl = useIntl();

  const actions = FORMS_SETTINGS[ENTITY_KEYS.MAPPING_PROFILES].DECORATORS.REPEATABLE_ACTIONS;
  const dataOptions = Object.keys(actions).map(key => ({
    value: key,
    label: intl.formatMessage({ id: actions[key] }),
  }));

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
        <WithTranslation
          wrapperLabel={wrapperPlaceholder}
        >
          {placeholder => (
            <Field
              name={wrapperFieldName}
              component={Select}
              dataOptions={dataOptions}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
        </WithTranslation>
      </div>
      {children}
    </div>
  );
});

RepeatableActionsField.propTypes = {
  children: PropTypes.node.isRequired,
  wrapperFieldName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  wrapperPlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

RepeatableActionsField.defaultProps = {
  disabled: false,
  wrapperPlaceholder: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions',
};
