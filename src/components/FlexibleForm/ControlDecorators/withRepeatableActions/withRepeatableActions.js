import React, { memo } from 'react';
import { PropTypes } from 'prop-types';
import {
  intlShape,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'redux-form';
import classNames from 'classnames';

import {
  get,
  identity,
  isEmpty,
} from 'lodash';

import { Select } from '@folio/stripes/components';

import {
  ENTITY_KEYS,
  FORMS_SETTINGS,
  isFormattedMessage,
  isTranslationId,
} from '../../../../utils';

import styles from './withRepeatableActions.css';

export const withRepeatableActions = memo(props => {
  const {
    intl,
    enabled,
    legend,
    referenceTable,
    children,
    wrapperLabel,
    wrapperFieldName,
  } = props;

  const actions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'REPEATABLE_ACTIONS'], []);
  const dataOptions = Object.keys(actions).map(key => ({
    value: key,
    label: intl.formatMessage({ id: actions[key] }),
  }));

  const needsTranslation = wrapperLabel && !isFormattedMessage(wrapperLabel) && isTranslationId(wrapperLabel);
  const hasRecords = !isEmpty(referenceTable);

  return (
    <div className={classNames(styles.decorator, isEmpty(legend) ? styles['no-legend'] : '')}>
      {enabled && hasRecords && (
        <>
          {needsTranslation ? (
            <FormattedMessage id={wrapperLabel}>
              {placeholder => (
                <Field
                  name={wrapperFieldName}
                  component={Select}
                  itemToString={identity}
                  dataOptions={dataOptions}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          ) : (
            <Field
              name={wrapperFieldName}
              component={Select}
              itemToString={identity}
              dataOptions={dataOptions}
              placeholder={wrapperLabel}
            />
          )}
        </>
      )}
      {children}
    </div>
  );
});

withRepeatableActions.propTypes = {
  intl: intlShape.isRequired,
  enabled: PropTypes.bool.isRequired,
  referenceTable: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: Node.isRequired,
  wrapperFieldName: PropTypes.string.isRequired,
  legend: PropTypes.oneOfType([PropTypes.string, Node]),
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, Node]),
};

withRepeatableActions.defaultProps = { wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions' };
