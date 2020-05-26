import React, {
  memo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { PropTypes } from 'prop-types';
import { isEmpty } from 'lodash';

import { WithTranslation } from '../../..';
import { OptionsList } from '../partials';

import styles from './withReferenceValues.css';

export const withReferenceValues = memo(({
  id,
  input,
  dataOptions,
  optionValue,
  optionLabel,
  wrappedComponent,
  wrapperLabel,
  disabled,
  ...rest
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [listOptions, setListOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(input?.value || '');

  useEffect(() => {
    setHasLoaded(!isEmpty(dataOptions));
    setListOptions(dataOptions);
  }, [dataOptions]);

  const currentInput = useRef(input);

  const handleChange = e => {
    const val = e.target ? e.target.value : e;

    setCurrentValue(val);
    input.onChange(e);
  };

  const onValueSelect = wrapperValue => {
    let newValue = '';

    if (wrapperValue) {
      if (!currentValue) {
        newValue = `"${wrapperValue}"`;
      } else {
        newValue = `${currentValue} "${wrapperValue}"`;
      }
    }

    if (newValue) {
      setCurrentValue(newValue);
      handleChange(newValue);
    }
  };

  const Component = wrappedComponent;

  const {
    onBlur,
    onDragStart,
    onDrop,
    onFocus,
  } = input;

  return (
    <div className={styles.decorator}>
      <Component
        value={currentValue}
        inputRef={currentInput}
        onBlur={onBlur}
        onChange={handleChange}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onFocus={onFocus}
        loading={!hasLoaded}
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
            dataOptions={listOptions}
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
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  optionValue: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  wrappedComponent: PropTypes.oneOfType([React.Component, PropTypes.func]).isRequired,
  id: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, Node]),
  disabled: PropTypes.bool,
};

withReferenceValues.defaultProps = {
  id: null,
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
  disabled: false,
};
