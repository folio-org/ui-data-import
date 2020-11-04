import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { isEmpty } from 'lodash';

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
}) => {
  const [listOptions, setListOptions] = useState(acceptedValuesList);

  const getAcceptedValuesObj = data => {
    let acceptedValues = {};

    data.forEach(item => {
      acceptedValues = {
        ...acceptedValues,
        [item.id]: optionTemplate ? updateValueWithTemplate(item, optionTemplate) : item[optionValue],
      };
    });

    return acceptedValues;
  };

  const updateListOptions = data => data.map(option => ({
    ...option,
    name: optionTemplate ? updateValueWithTemplate(option, optionTemplate) : option.name,
  }));

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
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const memoizedValidation = useCallback(
    validateAcceptedValues(listOptions, optionValue),
    [listOptions],
  );

  const validateAcceptedValueField = useCallback(
    value => validateMARCWithElse(value, isRemoveValueAllowed),
    [isRemoveValueAllowed],
  );

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
      validate={[validateAcceptedValueField, memoizedValidation]}
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
        onChange={onChange}
        label={label}
        wrapperLabel={wrapperLabel}
        optionValue={optionValue}
        optionLabel={optionLabel}
        dirty={isDirty}
        okapi={okapi}
      />
    );
  };

  return isFormField ? renderFormField() : renderElement();
};

AcceptedValuesField.propTypes = {
  component: PropTypes.oneOfType([React.Component, PropTypes.func]).isRequired,
  optionValue: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  okapi: okapiShape.isRequired,
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
  isDirty: PropTypes.bool,
  isFormField: PropTypes.bool,
};

AcceptedValuesField.defaultProps = {
  acceptedValuesList: [],
  isRemoveValueAllowed: false,
  isFormField: true,
};
