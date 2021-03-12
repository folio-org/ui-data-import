import React, {
  memo,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import uniqueId from 'lodash/uniqueId';

import { Label } from '@folio/stripes-components';
import { DATE_FORMAT } from '@folio/stripes-acq-components';

import {
  WithTranslation,
  TextDate,
  OptionsList,
} from '..';

import {
  FORMS_SETTINGS,
  ENTITY_KEYS,
  formatDecoratorValue,
} from '../../utils';

import styles from './DatePickerDecorator.css';

export const DatePickerDecorator = memo(({
  id,
  input,
  label,
  required,
  readOnly,
  wrapperLabel,
  wrappedComponent,
  ...rest
}) => {
  const {
    TODAY,
    CHOOSE_DATE,
  } = FORMS_SETTINGS[ENTITY_KEYS.MAPPING_PROFILES].DECORATORS.DATE_PICKER;

  const [currentValue, setCurrentValue] = useState(input.value || '');
  const [isDatepicker, setIsDatepicker] = useState(false);
  const fieldId = useMemo(() => uniqueId('decorated-field-'), []);

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

  const decoratorDatepickerValueRegExp = /###TODAY###|"[^"]+"/g;

  const handleChange = e => {
    setCurrentValue(e.target ? e.target.value : e);
    input.onChange(e);
  };

  const handleSetDate = value => {
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

  const Component = !isDatepicker ? wrappedComponent : TextDate;

  const {
    onBlur,
    onDragStart,
    onDrop,
    onFocus,
  } = input;

  const commonProps = {
    id: fieldId,
    value: currentValue,
    inputRef: currentInput,
    readOnly,
    onBlur,
    onChange: handleChange,
    onDragStart,
    onDrop,
    onFocus,
    ...rest,
  };

  const datePickerProps = {
    ...commonProps,
    onSetDate: handleSetDate,
    dateFormat: DATE_FORMAT,
    intl,
  };

  const wrappedComponentProps = isDatepicker ? datePickerProps : commonProps;

  return (
    <div
      data-test-date-picker
      data-testid="date-picker-decorator"
      className={styles.decoratorWrapper}
    >
      {label && (
        <Label
          htmlFor={fieldId}
          required={required}
          readOnly={readOnly}
        >
          {label}
        </Label>
      )}
      <div className={styles.decorator}>
        <Component
          {...wrappedComponentProps}
        />
        <WithTranslation
          wrapperLabel={wrapperLabel}
        >
          {listLabel => (
            <OptionsList
              id={id}
              label={listLabel}
              dataOptions={dataOptions}
              optionValue="value"
              optionLabel="name"
              className={styles['options-dropdown']}
              onSelect={handleChangeWrapperValue}
            />
          )}
        </WithTranslation>
      </div>
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
  wrappedComponent: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]).isRequired,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
};

DatePickerDecorator.defaultProps = {
  id: '',
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
  required: false,
  readOnly: false,
};
