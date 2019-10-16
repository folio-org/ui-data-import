import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';

import {
  Headline,
  TextArea,
  TextField,
  Accordion,
  AccordionSet,
  ConfirmationModal,
} from '@folio/stripes/components';

import {
  FullScreenForm,
  RecordTypesSelect,
} from '..';

const Control = props => {
  const {
    controlType: Component,
    dataAttributes,
  } = props;

  return <Component {...dataAttributes} />;
};

/**
 * Hook that provides forms renderer functionality
 *
 * @param {Component<props>} Component
 * @param {{}} attributes
 * @param {{}} config
 * @return {{ renderForm: () => Node }}
 */
export const useFormRenderer = (Component = <form />, attributes = {}, config = {}) => {
  const renderForm = () => (
    <Component {...attributes}>
      {config.children && config.children.length && config.children.map(cfg => <Control {...cfg} />)}
    </Component>
  );

  return { renderForm };
};

export const withFormRenderer = WrappedComponent => props => {
  const {
    component,
    attributes,
    config,
  } = props;
  const formRenderer = useFormRenderer(component, attributes, config);

  return (
    <WrappedComponent
      {...props}
      formRenderer={formRenderer}
    />
  );
};

export const formRendererShape = PropTypes.shape({ renderForm: PropTypes.func.isRequired });
