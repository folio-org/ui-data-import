import React, {
  memo,
  useRef,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import { injectIntl } from 'react-intl';
import { get } from 'lodash';

import { Select } from '@folio/stripes/components';

import { WithTranslation } from '../../..';

import {
  compose,
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
  const dataOptions = actions.OPTIONS.map(action => ({
    value: action.value,
    label: intl.formatMessage({ id: action.label }),
  }));

  const isDefaultValueExist = input?.value && dataOptions.some(option => option.value === input.value);
  const defaultValue = isDefaultValueExist ? input.value : '';

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChangeWrapperValue = wrapperValue => {
    let newValue;

    if (wrapperValue) {
      newValue = wrapperValue;
    }

    setCurrentValue(newValue);
    input.onChange(newValue);
  };

  const currentInput = useRef(input);

  return (
    <div className={styles.decorator}>
      <WrappedComponent
        value={currentValue}
        inputRef={currentInput}
        {...rest}
      />

      <WithTranslation
        wrapperLabel={wrapperLabel}
      >
        {placeholder => (
          <Select
            id={id}
            label={label}
            placeholder={placeholder}
            value={currentValue}
            dataOptions={dataOptions}
            onChange={e => handleChangeWrapperValue(e.target.value)}
          />
        )}
      </WithTranslation>
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
