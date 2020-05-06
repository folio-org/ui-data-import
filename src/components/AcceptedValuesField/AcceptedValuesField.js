import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { withReferenceValues } from '../FlexibleForm/ControlDecorators/withReferenceValues';

import { fetchAcceptedValuesList } from './fetchAcceptedValuesList';
import {
  validateMARCWithElse,
  validateAcceptedValues,
} from '../../utils';

export const AcceptedValuesField = ({
  id,
  meta,
  name,
  label,
  okapi,
  component,
  wrapperLabel,
  wrapperSourceLink,
  wrapperSourcePath,
  wrapperExplicitInsert,
  dataAttributes,
}) => {
  const [dataOptions, setDataOptions] = useState([]);

  useEffect(() => {
    fetchAcceptedValuesList(okapi, wrapperSourceLink, wrapperSourcePath)
      .then(setDataOptions);
  }, [okapi, wrapperSourceLink, wrapperSourcePath]);

  const memoizedValidation = useCallback(
    validateAcceptedValues(dataOptions),
    [dataOptions],
  );

  return (
    <Field
      {...meta}
      id={id}
      component={withReferenceValues}
      name={name}
      label={label}
      dataOptions={dataOptions}
      WrappedComponent={component}
      wrapperLabel={wrapperLabel}
      wrapperExplicitInsert={wrapperExplicitInsert}
      validate={[memoizedValidation, validateMARCWithElse]}
      {...dataAttributes}
    />
  );
};

AcceptedValuesField.propTypes = {
  component: PropTypes.oneOfType([React.Component, PropTypes.func]).isRequired,
  name: PropTypes.string.isRequired,
  wrapperSourceLink: PropTypes.string.isRequired,
  wrapperSourcePath: PropTypes.string.isRequired,
  okapi: PropTypes.shape({
    tenant: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  meta: PropTypes.object.isRequired,
  wrapperLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  wrapperExplicitInsert: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  id: PropTypes.string,
  dataAttributes: PropTypes.arrayOf(PropTypes.object),
};
