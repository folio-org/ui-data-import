import React, {
  memo,
  useRef,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { get } from 'lodash';

import { Select } from '@folio/stripes/components';

import {
  compose,
  isFormattedMessage,
  isTranslationId,
  ENTITY_KEYS,
  FORMS_SETTINGS,
} from '../../../../utils';

import styles from './withBooleanActions.css';

const WithBooleanActionsControl = props => {
  const {
    intl,
    id,
    input,
    WrappedComponent,
    wrapperLabel,
    label,
    ...rest
  } = props;

  const actions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'BOOLEAN_ACTIONS'], []);
  const dataOptions = actions.map(action => ({
    value: action.value,
    label: intl.formatMessage({ id: action.label }),
  }));

  const [currentValue, setCurrentValue] = useState(input?.value || '');

  const handleChangeWrapperValue = wrapperValue => {
    let newValue;

    if (wrapperValue) {
      newValue = wrapperValue;
    }

    setCurrentValue(newValue);
    input.onChange(newValue);
  };

  const needsTranslation = wrapperLabel && !isFormattedMessage(wrapperLabel) && isTranslationId(wrapperLabel);
  const currentInput = useRef(input);

  return (
    <div className={styles.decorator}>
      <WrappedComponent
        value={currentValue}
        inputRef={currentInput}
        {...rest}
      />

      {needsTranslation ? (
        <FormattedMessage id={wrapperLabel}>
          {localized => (
            <Select
              id={id}
              label={label}
              placeholder={localized}
              value={currentValue}
              dataOptions={dataOptions}
              onChange={e => handleChangeWrapperValue(e.target.value)}
            />
          )}
        </FormattedMessage>
      ) : (
        <Select
          id={id}
          label={label}
          placeholder={wrapperLabel}
          value={currentValue}
          dataOptions={dataOptions}
          onChange={e => handleChangeWrapperValue(e.target.value)}
        />
      )}
    </div>
  );
};

WithBooleanActionsControl.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  WrappedComponent: PropTypes.oneOfType([React.Component, PropTypes.func]).isRequired,
  id: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, Node]),
  intl: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, Node]),
};

WithBooleanActionsControl.defaultProps = {
  id: null,
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.administrativeData.field.selectCheckboxFieldMapping',
};

export const withBooleanActions = compose(
  injectIntl,
  memo,
)(WithBooleanActionsControl);
