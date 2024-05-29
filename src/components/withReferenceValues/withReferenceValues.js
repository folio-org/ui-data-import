import React, {
  memo,
  useMemo,
} from 'react';
import { PropTypes } from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import { Label } from '@folio/stripes/components';

import {
  WithTranslation,
  OptionsList,
} from '..';

import { formatDecoratorValue } from '../../utils';

import styles from './withReferenceValues.css';

const decoratorValueRegExp = /"[^"]+"/g;
const defaultWrapperLabel = 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues';

export const withReferenceValues = memo(({
  id = null,
  input,
  value,
  label,
  onFieldChange,
  dataOptions,
  optionValue,
  optionLabel,
  wrappedComponent,
  wrapperLabel = defaultWrapperLabel,
  disabled = false,
  required = false,
  readOnly = false,
  isMultiSelection = false,
  hasLoaded = false,
  ...rest
}) => {
  const currentValue = input?.value || value;
  const fieldId = useMemo(() => uniqueId('decorated-field-'), []);

  const handleChange = e => {
    const val = e.target ? e.target.value : e;

    if (input?.onChange) {
      input.onChange(e);
    }

    if (typeof onFieldChange === 'function') {
      onFieldChange(val);
    }
  };

  const onValueSelect = wrapperValue => {
    const newValue = wrapperValue ? formatDecoratorValue(currentValue, wrapperValue, decoratorValueRegExp, true, isMultiSelection) : '';

    if (newValue) {
      handleChange(newValue);
    }
  };

  const Component = wrappedComponent;

  return (
    <div className={styles.decoratorWrapper}>
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
          id={fieldId}
          value={currentValue}
          onBlur={input?.onBlur}
          onChange={handleChange}
          onDragStart={input?.onDragStart}
          onDrop={input?.onDrop}
          onFocus={input?.onFocus}
          loading={!disabled ? !hasLoaded : false}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={input?.name}
          {...rest}
        />
        <WithTranslation
          wrapperLabel={wrapperLabel}
        >
          {listLabel => (
            <OptionsList
              id={id}
              label={listLabel}
              dataOptions={dataOptions}
              optionValue={optionValue}
              optionLabel={optionLabel}
              className={styles['options-dropdown']}
              disabled={!hasLoaded || disabled}
              onSelect={onValueSelect}
            />
          )}
        </WithTranslation>
      </div>
    </div>
  );
});

withReferenceValues.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  optionValue: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  wrappedComponent: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]).isRequired,
  input: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFieldChange: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isMultiSelection: PropTypes.bool,
  hasLoaded: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
};
