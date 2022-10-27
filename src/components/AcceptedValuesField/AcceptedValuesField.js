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
} from 'lodash';

import { sortCollection } from '@folio/stripes-data-transfer-components';

import { withReferenceValues } from '..';

import { fetchAcceptedValuesList } from './fetchAcceptedValuesList';
import {
  validateMARCWithElse,
  validateAcceptedValues,
  updateValueWithTemplate,
  okapiShape,
} from '../../utils';

export const AcceptedValuesField = ({
  id,
  name,
  label,
  okapi,
  component,
  optionValue,
  optionLabel,
  parsedOptionValue,
  parsedOptionLabel,
  wrapperLabel,
  acceptedValuesList,
  wrapperSources,
  wrapperSourcesFn,
  setAcceptedValues,
  acceptedValuesPath,
  dataAttributes,
  optionTemplate,
  isRemoveValueAllowed,
  componentValue,
  onChange,
  isDirty,
  isFormField,
  isMultiSelection,
  disabled,
  required,
  validation,
  hasLoaded,
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

  const updateListOptions = data => data.map(option => {
    let currentOption = optionTemplate ? updateValueWithTemplate(option, optionTemplate) : option[optionLabel];

    if (parsedOptionLabel) {
      currentOption = JSON.parse(currentOption)[parsedOptionLabel];
    }

    return {
      ...option,
      [optionLabel]: currentOption,
    };
  });

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
  optionValue: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  okapi: okapiShape,
  name: PropTypes.string,
  optionTemplate: PropTypes.string,
  acceptedValuesList: PropTypes.arrayOf(PropTypes.object),
  wrapperSources: PropTypes.arrayOf(PropTypes.object),
  wrapperSourcesFn: PropTypes.string,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  id: PropTypes.string,
  setAcceptedValues: PropTypes.func,
  acceptedValuesPath: PropTypes.string,
  dataAttributes: PropTypes.arrayOf(PropTypes.object),
  isRemoveValueAllowed: PropTypes.bool,
  onChange: PropTypes.func,
  componentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isMultiSelection: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isDirty: PropTypes.bool,
  isFormField: PropTypes.bool,
  parsedOptionValue: PropTypes.string,
  parsedOptionLabel: PropTypes.string,
  validation: PropTypes.func,
  hasLoaded: PropTypes.bool,
};

AcceptedValuesField.defaultProps = {
  acceptedValuesList: [],
  isRemoveValueAllowed: false,
  isFormField: true,
  isMultiSelection: false,
  parsedOptionValue: '',
  parsedOptionLabel: '',
  required: false,
  disabled: false,
  hasLoaded: false,
};
