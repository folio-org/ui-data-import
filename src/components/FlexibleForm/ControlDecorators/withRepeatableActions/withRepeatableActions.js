import React, {
  memo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

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
    id,
    input,
    WrappedComponent,
    wrapperLabel,
    ...rest
  } = props;

  const [wrapperValue, setWrapperValue] = useState(null);
  const actions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'REPEATABLE_ACTIONS'], []);
  const dataOptions = Object.keys(actions).map(key => ({
    value: key,
    label: actions.key,
  }));

  const handleChange = e => {
    setWrapperValue(e.target ? e.target.value : e);
    input.onChange(e);
  };

  useLayoutEffect(() => {
    if (wrapperValue) {
      handleChange(wrapperValue);
    }
  }, [wrapperValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const needsTranslation = wrapperLabel && !isFormattedMessage(wrapperLabel) && isTranslationId(wrapperLabel);
  const currentInput = useRef(input);

  const {
    onBlur,
    onDragStart,
    onDrop,
    onFocus,
  } = input;

  return (
    <div className={styles.decorator}>
      <WrappedComponent
        inputRef={currentInput}
        onBlur={onBlur}
        onChange={handleChange}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onFocus={onFocus}
        {...rest}
      />
      {needsTranslation ? (
        <FormattedMessage id={wrapperLabel}>
          {localized => (
            <Select
              id={id}
              label={localized}
              dataOptions={dataOptions}
              optionValue="id"
              optionLabel="name"
              className={styles['options-dropdown']}
              onSelect={setWrapperValue}
            />
          )}
        </FormattedMessage>
      ) : (
        <Select
          id={id}
          label={wrapperLabel}
          dataOptions={dataOptions}
          optionValue="id"
          optionLabel="name"
          className={styles['options-dropdown']}
          onSelect={setWrapperValue}
        />
      )}
    </div>
  );
});

withRepeatableActions.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  WrappedComponent: PropTypes.oneOfType([React.Component, PropTypes.func]).isRequired,
  id: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, Node]),
};

withRepeatableActions.defaultProps = {
  id: null,
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
};
