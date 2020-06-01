import React, {
  memo,
  useRef,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import { DATE_FORMAT } from '@folio/stripes-acq-components';

import {
  OptionsList,
  TextDate,
} from '../partials';
import {
  isFormattedMessage,
  isTranslationId,
  formatDecoratorValue,
  FORMS_SETTINGS,
  ENTITY_KEYS,
} from '../../../../utils';

import styles from './withDatePicker.css';

export const withDatePicker = memo(props => {
  const {
    id,
    input,
    wrapperLabel,
    WrappedComponent,
    ...rest
  } = props;
  const [currentValue, setCurrentValue] = useState(input?.value || '');
  const [isDatepicker, setIsDatepicker] = useState(false);

  const {
    TODAY,
    CHOOSE_DATE,
  } = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'DATE_PICKER'], []);

  const dataOptions = [
    {
      value: TODAY.value,
      name: <FormattedMessage id={TODAY.id} />,
    },
    {
      value: CHOOSE_DATE.value,
      name: <FormattedMessage id={CHOOSE_DATE.id} />,
    },
  ];

  const decoratorDatepickerValueRegExp = /###TODAY###|"[^"]+"/g;

  const handleChange = e => {
    setCurrentValue(e.target ? e.target.value : e);
    input.onChange(e);
  };

  const handleSetDate = (e, value) => {
    const newValue = formatDecoratorValue(currentValue, value, decoratorDatepickerValueRegExp, true);

    setCurrentValue(newValue);
    input.onChange(newValue);
  };

  const handleChangeWrapperValue = wrapperValue => {
    let newValue = '';

    if (wrapperValue === TODAY.value) {
      const newWrapperValue = `###${wrapperValue}###`;

      setIsDatepicker(false);
      newValue = formatDecoratorValue(currentValue, newWrapperValue, decoratorDatepickerValueRegExp, false);
      handleChange(newValue);
    }

    if (wrapperValue === CHOOSE_DATE.value) {
      setIsDatepicker(true);
    }
  };

  const needsTranslation = wrapperLabel && !isFormattedMessage(wrapperLabel) && isTranslationId(wrapperLabel);
  const currentInput = useRef(input);
  const Wrapper = !isDatepicker ? WrappedComponent : TextDate;

  const {
    onBlur,
    onDragStart,
    onDrop,
    onFocus,
  } = input;

  return (
    <div
      className={styles.decorator}
      data-test-date-picker
    >
      <Wrapper
        value={currentValue}
        inputRef={currentInput}
        onBlur={onBlur}
        onChange={handleChange}
        onSetDate={handleSetDate}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onFocus={onFocus}
        dateFormat={DATE_FORMAT}
        {...rest}
      />
      {needsTranslation ? (
        <FormattedMessage id={wrapperLabel}>
          {localized => (
            <OptionsList
              id={id}
              label={localized}
              dataOptions={dataOptions}
              optionValue="value"
              optionLabel="name"
              className={styles['options-dropdown']}
              onSelect={handleChangeWrapperValue}
            />
          )}
        </FormattedMessage>
      ) : (
        <OptionsList
          id={id}
          label={wrapperLabel}
          dataOptions={dataOptions}
          optionValue="value"
          optionLabel="name"
          className={styles['options-dropdown']}
          onSelect={handleChangeWrapperValue}
        />
      )}
    </div>
  );
});

withDatePicker.propTypes = {
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

withDatePicker.defaultProps = {
  id: null,
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
};
