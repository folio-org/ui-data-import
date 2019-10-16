import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';

import * as stripesComponents from '@folio/stripes/components';

import * as components from '..';

const controls = {
  Field,
  ...stripesComponents,
  ...components,
};

export const Control = memo(props => {
  const {
    controlType,
    children,
    dataAttributes,
    ...cfg
  } = props;

  const cProps = Object.entries(cfg).map(prop => {
    return prop;
  });

  const Component = controls[controlType];

  return <Component {...dataAttributes} />;
});

export const FlexibleForm = memo(props => {
  const {
    component,
    config,
    config: { children },
    dataAttributes,
    ...attributes
  } = props;
  const hasChildren = cfg => cfg.children && cfg.children.length;
  const Ctrl = controls[component];

  return (
    <Ctrl {...attributes}>
      {hasChildren(config) && children.map(cfg => {
        return (
          <Control {...cfg} />
        );
      })}
    </Ctrl>
  );
});
