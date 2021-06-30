import React, {
  memo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Select,
  Headline,
} from '@folio/stripes/components';

import { WithTranslation } from '..';

import {
  MAPPING_REPEATABLE_FIELD_ACTIONS,
  REPEATABLE_ACTIONS,
  validateRepeatableActionsField,
  repeatableFieldActionShape,
  isFieldPristine,
} from '../../utils';

import styles from './RepeatableActionsField.css';

export const RepeatableActionsField = memo(({
  wrapperFieldName,
  legend,
  wrapperPlaceholder,
  repeatableFieldAction,
  repeatableFieldIndex,
  hasRepeatableFields,
  onRepeatableActionChange,
  actions,
  actionToClearFields,
  subfieldsToClearPath,
  disabled,
  children,
}) => {
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);

  useEffect(() => {
    setIsAddButtonDisabled(repeatableFieldAction === actionToClearFields);
  }, [actionToClearFields, repeatableFieldAction]);

  const intl = useIntl();

  const dataOptions = actions.map(action => ({
    value: action.value,
    label: intl.formatMessage({ id: action.label }),
  }));

  const validateRepeatableActions = useCallback(
    value => (value !== actionToClearFields) && validateRepeatableActionsField(value, hasRepeatableFields),
    [actionToClearFields, hasRepeatableFields],
  );

  const handleRepeatableActionChange = value => {
    if (value === actionToClearFields) {
      onRepeatableActionChange(subfieldsToClearPath || `profile.mappingDetails.mappingFields[${repeatableFieldIndex}].subfields`, []);
    }
  };

  const legendHeadline = (
    <Headline
      data-test-repeatable-field-legend
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
              validate={validateRepeatableActions}
              disabled={disabled}
              isEqual={isFieldPristine}
              render={fieldProps => (
                <Select
                  {...fieldProps}
                  dataOptions={dataOptions}
                  placeholder={placeholder}
                  aria-label={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions' })}
                  onChange={e => {
                    const value = e.target.value;

                    handleRepeatableActionChange(value);
                    fieldProps.input.onChange(value);
                  }}
                />
              )}
            />
          )}
        </WithTranslation>
      </div>
      {children(isAddButtonDisabled)}
    </div>
  );
});

RepeatableActionsField.propTypes = {
  children: PropTypes.func.isRequired,
  wrapperFieldName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  wrapperPlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  repeatableFieldAction: PropTypes.string.isRequired,
  repeatableFieldIndex: PropTypes.number.isRequired,
  hasRepeatableFields: PropTypes.bool.isRequired,
  onRepeatableActionChange: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(repeatableFieldActionShape),
  actionToClearFields: PropTypes.string,
  subfieldsToClearPath: PropTypes.string,
};

RepeatableActionsField.defaultProps = {
  disabled: false,
  wrapperPlaceholder: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions',
  actions: MAPPING_REPEATABLE_FIELD_ACTIONS,
  actionToClearFields: REPEATABLE_ACTIONS.DELETE_EXISTING,
  subfieldsToClearPath: '',
};
