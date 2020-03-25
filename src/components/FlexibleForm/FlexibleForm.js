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
    config: {
      name,
      commonSections,
      staticNamespace,
      editableNamespace,
      childControls,
    },
    styles,
    record,
    injectedProps,
    stateMethods,
    referenceTables,
    initialFields,
    dataAttributes,
    ...attributes
  } = props;
  const Ctrl = getControl(component);
  const attrs = {
    ...attributes,
    ...dataAttributes,
  };

  const setReferenceTables = (fieldsPath, refTable) => {
    const {
      dispatch,
      change,
    } = stateMethods;

    dispatch(change(name, fieldsPath, refTable));
  };

  return (
    <IntlConsumer>
      {intl => (
        <Ctrl {...attrs}>
          {hasChildren(config) && childControls.map((cfg, i) => {
            return (
              <Control
                key={`control-${i}`}
                staticNamespace={staticNamespace}
                editableNamespace={editableNamespace}
                intl={intl}
                styles={styles}
                referenceTables={referenceTables}
                setReferenceTables={setReferenceTables}
                injectedProps={injectedProps}
                initialFields={initialFields}
                commonSections={commonSections}
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
  initialFields: PropTypes.object,
  record: PropTypes.object,
  injectedProps: PropTypes.object,
  stateMethods: PropTypes.objectOf(PropTypes.func),
};
