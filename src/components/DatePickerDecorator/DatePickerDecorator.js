import React, {
  memo,
  useRef,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { get } from 'lodash';

import { DATE_FORMAT } from '@folio/stripes-acq-components';

import { WithTranslation } from '..';
import {
  OptionsList,
  TextDate,
} from '../FlexibleForm/ControlDecorators/partials';

import {
  FORMS_SETTINGS,
  ENTITY_KEYS,
} from '../../utils';

import styles from './DatePickerDecorator.css';

export const DatePickerDecorator = memo(props => {
  const {
    id,
    input,
    wrapperLabel,
    wrappedComponent,
    ...rest
  } = props;
  const {
    TODAY,
    CHOOSE_DATE,
  } = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'DATE_PICKER'], []);

  const [currentValue, setCurrentValue] = useState(input?.value || '');
  const [isDatepicker, setIsDatepicker] = useState(false);

  const currentInput = useRef(input);
  const intl = useIntl();

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

  const handleChange = e => {
    setCurrentValue(e.target ? e.target.value : e);
    input.onChange(e);
  };

  const handleSetDate = (e, value) => {
    const newValue = currentValue ? `${currentValue} "${value}"` : `"${value}"`;

    setCurrentValue(newValue);
    input.onChange(newValue);
  };

  const handleChangeWrapperValue = wrapperValue => {
    let newValue = '';

    if (wrapperValue === TODAY.value) {
      setIsDatepicker(false);
      newValue = currentValue ? `${currentValue} ###TODAY###` : '###TODAY###';
      handleChange(newValue);
    }

    if (wrapperValue === CHOOSE_DATE.value) {
      setIsDatepicker(true);
    }
  };

  const Component = !isDatepicker ? wrappedComponent : TextDate;

  const {
    onBlur,
    onDragStart,
    onDrop,
    onFocus,
  } = input;

  let commonProps = {
    value: currentValue,
    inputRef: currentInput,
    onBlur,
    onChange: handleChange,
    onDragStart,
    onDrop,
    onFocus,
    ...rest,
  };

  const datePickerProps = {
    onSetDate: handleSetDate,
    dateFormat: DATE_FORMAT,
    intl,
  };

  if (isDatepicker) {
    commonProps = {
      ...commonProps,
      ...datePickerProps,
    };
  }

  return (
    <div
      data-test-date-picker
      className={styles.decorator}
    >
      <Component
        {...commonProps}
      />
      <WithTranslation
        wrapperLabel={wrapperLabel}
      >
        {label => (
          <OptionsList
            id={id}
            label={label}
            dataOptions={dataOptions}
            optionValue="value"
            optionLabel="name"
            className={styles['options-dropdown']}
            onSelect={handleChangeWrapperValue}
          />
        )}
      </WithTranslation>
    </div>
  );
});

DatePickerDecorator.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  wrappedComponent: PropTypes.oneOfType([React.Component, PropTypes.func]).isRequired,
  id: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, Node]),
};

DatePickerDecorator.defaultProps = {
  id: '',
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
};
