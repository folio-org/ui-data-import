import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  isEmpty,
  isEqual,
  noop,
} from 'lodash';

import { sortCollection } from '@folio/stripes-data-transfer-components';

import { withReferenceValues } from '..';

import { fetchAcceptedValuesList } from './fetchAcceptedValuesList';
import {
  validateMARCWithElse,
  validateAcceptedValues,
  updateValueWithTemplate,
  okapiShape,
  validateRequiredField,
} from '../../utils';

export const AcceptedValuesField = ({
  acceptedValuesList,
  acceptedValuesPath,
  component,
  componentValue,
  dataAttributes,
  disabled,
  format,
  formatListOptions,
  hasLoaded,
  id,
  isDirty,
  isFormField,
  isMultiSelection,
  isRemoveValueAllowed,
  label,
  name,
  okapi,
  onChange,
  optionLabel,
  optionTemplate,
  optionValue,
  parse,
  parsedOptionLabel,
  parsedOptionValue,
  required,
  setAcceptedValues,
  validation,
  wrapperLabel,
  wrapperSources,
  wrapperSourcesFn,
}) => {
  const [listOptions, setListOptions] = useState(acceptedValuesList);
  const [hasOptions, setHasOptions] = useState(hasLoaded || !isEmpty(listOptions));

  const getAcceptedValuesObj = data => {
    let acceptedValues = {};

    data.forEach(item => {
      let currentOptionValue = optionTemplate ? updateValueWithTemplate(item, optionTemplate) : item[optionValue];

      if (parsedOptionValue) {
        currentOptionValue = JSON.parse(currentOptionValue)[parsedOptionValue];
      }

      acceptedValues = {
        ...acceptedValues,
        [item.id]: currentOptionValue,
      };
    });

    return acceptedValues;
  };

  const updateListOptions = data => {
    let options = data.map(option => {
      let currentOption = optionTemplate ? updateValueWithTemplate(option, optionTemplate) : option[optionLabel];

      if (parsedOptionLabel) {
        currentOption = JSON.parse(currentOption)[parsedOptionLabel];
      }

      return {
        ...option,
        [optionLabel]: currentOption,
      };
    });

    if (formatListOptions) {
      options = formatListOptions(options);
    }

    return options;
  };

  const extendDataWithStatisticalCodeType = (arrToExtend, arrWithExtendedField) => {
    const extendedData = sortCollection(arrToExtend, ['code']).map(item => {
      const correspondRecord = arrWithExtendedField.find(itemAlt => itemAlt.id === item.statisticalCodeTypeId);

      return {
        ...item,
        statisticalCodeTypeName: correspondRecord.name,
      };
    });

    return sortCollection(extendedData, ['statisticalCodeTypeName']);
  };

  const mappedFns = { statisticalCodeTypeName: extendDataWithStatisticalCodeType };

  useEffect(() => {
    if (wrapperSources && isEmpty(acceptedValuesList)) {
      const promises = wrapperSources.map(source => fetchAcceptedValuesList(okapi, source.wrapperSourceLink, source.wrapperSourcePath));

      Promise.all(promises).then(result => {
        const dataWithExtendField = wrapperSourcesFn ? mappedFns[wrapperSourcesFn](result[0], result[1]) : '';
        const data = dataWithExtendField || result[0];
        const acceptedValues = getAcceptedValuesObj(data);
        const updatedListOptions = updateListOptions(data);

        setListOptions(updatedListOptions);
        setAcceptedValues(acceptedValuesPath, acceptedValues);
        setHasOptions(true);
      });
    }

    if (!isEqual(listOptions, acceptedValuesList)) {
      setListOptions(acceptedValuesList);
      setHasOptions(true);
    }
  }, [acceptedValuesList]); // eslint-disable-line react-hooks/exhaustive-deps

  const memoizedValidation = useCallback(
    validateAcceptedValues(listOptions, optionValue),
    [listOptions],
  );
  const validateAcceptedValueField = useCallback(
    value => !isMultiSelection && validateMARCWithElse(value, isRemoveValueAllowed),
    [isMultiSelection, isRemoveValueAllowed],
  );
  const customValidation = useCallback(validation, []);

  const fieldValidation = [customValidation || validateAcceptedValueField, memoizedValidation];

  if (required) {
    fieldValidation.push(validateRequiredField);
  }

  const renderFormField = () => (
    <Field
      id={id}
      component={withReferenceValues}
      name={name}
      label={label}
      dataOptions={listOptions}
      optionValue={optionValue}
      optionLabel={optionLabel}
      wrappedComponent={component}
      wrapperLabel={wrapperLabel}
      validate={fieldValidation}
      onFieldChange={onChange}
      isMultiSelection={isMultiSelection}
      disabled={disabled}
      required={required}
      hasLoaded={hasOptions}
      parse={parse}
      format={format}
      {...dataAttributes}
    />
  );

  const renderElement = () => {
    const WithReferenceValuesElement = withReferenceValues;

    return (
      <WithReferenceValuesElement
        wrappedComponent={component}
        dataOptions={listOptions}
        value={componentValue}
        onFieldChange={onChange}
        label={label}
        wrapperLabel={wrapperLabel}
        optionValue={optionValue}
        optionLabel={optionLabel}
        dirty={isDirty}
        isMultiSelection={isMultiSelection}
        okapi={okapi}
        hasLoaded={hasOptions}
      />
    );
  };

  return isFormField ? renderFormField() : renderElement();
};

AcceptedValuesField.propTypes = {
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]).isRequired,
  optionLabel: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  acceptedValuesList: PropTypes.arrayOf(PropTypes.object),
  acceptedValuesPath: PropTypes.string,
  componentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataAttributes: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  format: PropTypes.func,
  formatListOptions: PropTypes.func,
  hasLoaded: PropTypes.bool,
  id: PropTypes.string,
  isDirty: PropTypes.bool,
  isFormField: PropTypes.bool,
  isMultiSelection: PropTypes.bool,
  isRemoveValueAllowed: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  name: PropTypes.string,
  okapi: okapiShape,
  onChange: PropTypes.func,
  optionTemplate: PropTypes.string,
  parse: PropTypes.func,
  parsedOptionLabel: PropTypes.string,
  parsedOptionValue: PropTypes.string,
  required: PropTypes.bool,
  setAcceptedValues: PropTypes.func,
  validation: PropTypes.func,
  wrapperSources: PropTypes.arrayOf(PropTypes.object),
  wrapperSourcesFn: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

AcceptedValuesField.defaultProps = {
  acceptedValuesList: [],
  acceptedValuesPath: null,
  componentValue: null,
  dataAttributes: null,
  disabled: false,
  format: null,
  formatListOptions: null,
  hasLoaded: false,
  id: null,
  isDirty: false,
  isFormField: true,
  isMultiSelection: false,
  isRemoveValueAllowed: false,
  label: null,
  name: null,
  okapi: {},
  onChange: null,
  optionTemplate: null,
  parse: null,
  parsedOptionLabel: '',
  parsedOptionValue: '',
  required: false,
  setAcceptedValues: noop,
  validation: null,
  wrapperSources: null,
  wrapperSourcesFn: null,
  wrapperLabel: null,
};
