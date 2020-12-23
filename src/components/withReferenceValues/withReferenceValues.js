import React, { memo } from 'react';
import { PropTypes } from 'prop-types';

import {
  WithTranslation,
  OptionsList,
} from '..';

import { formatDecoratorValue } from '../../utils';

import styles from './withReferenceValues.css';

const decoratorValueRegExp = /"[^"]+"/g;

export const withReferenceValues = memo(({
  id,
  input,
  value,
  onFieldChange,
  dataOptions,
  optionValue,
  optionLabel,
  wrappedComponent,
  wrapperLabel,
  disabled,
  isMultiSelection,
  hasLoaded,
  ...rest
}) => {
  const currentValue = input?.value || value;

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
    <div className={styles.decorator}>
      <Component
        value={currentValue}
        onBlur={input?.onBlur}
        onChange={handleChange}
        onDragStart={input?.onDragStart}
        onDrop={input?.onDrop}
        onFocus={input?.onFocus}
        loading={!disabled ? !hasLoaded : false}
        disabled={disabled}
        {...rest}
      />
      <WithTranslation
        wrapperLabel={wrapperLabel}
      >
        {label => (
          <OptionsList
            id={id}
            label={label}
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
  }),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFieldChange: PropTypes.func,
  id: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, Node]),
  isMultiSelection: PropTypes.bool,
  hasLoaded: PropTypes.bool,
  disabled: PropTypes.bool,
};

withReferenceValues.defaultProps = {
  id: null,
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
  disabled: false,
  isMultiSelection: false,
  hasLoaded: false,
};
