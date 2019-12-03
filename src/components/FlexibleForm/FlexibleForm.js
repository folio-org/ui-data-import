import React, {
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { IntlConsumer } from '@folio/stripes/core';
import * as stripesComponents from '@folio/stripes/components';

import * as components from '..';
import { Control } from './Control';

const controls = {
  Fragment,
  Field,
  ...stripesComponents,
};

const getControl = controlType => components[controlType] || controls[controlType];
const hasChildren = cfg => cfg.childControls && cfg.childControls.length;

export const FlexibleForm = memo(props => {
  const {
    component,
    config,
    config: { childControls },
    styles,
    record,
    componentsProps,
    referenceTables,
    dataAttributes,
    ...attributes
  } = props;
  const Ctrl = getControl(component);
  const attrs = {
    ...attributes,
    ...dataAttributes,
  };

  return (
    <IntlConsumer>
      {intl => (
        <Ctrl {...attrs}>
          {hasChildren(config) && childControls.map((cfg, i) => {
            return (
              <Control
                key={`control-${i}`}
                intl={intl}
                styles={styles}
                referenceTables={referenceTables}
                componentsProps={componentsProps}
                record={record}
                {...cfg}
              />
            );
          })}
        </Ctrl>
      )}
    </IntlConsumer>
  );
});

FlexibleForm.propTypes = {
  component: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  styles: PropTypes.shape(PropTypes.string),
  childControls: PropTypes.arrayOf(Node),
  dataAttributes: PropTypes.object,
  referenceTables: PropTypes.object,
  record: PropTypes.object,
  componentsProps: PropTypes.object,
};
