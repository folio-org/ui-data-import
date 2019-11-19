import React, {
  Fragment,
  memo,
} from 'react';
import {
  FormattedMessage,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import * as stripesComponents from '@folio/stripes/components';
import * as components from '..';
import { isEmpty } from 'lodash';

const controls = {
  Field,
  ...stripesComponents,
};

const getControl = controlType => components[controlType] || controls[controlType];
const hasChildren = cfg => cfg.children && cfg.children.length;

export const Control = memo(props => {
  const {
    controlType,
    staticControlType,
    component,
    intl,
    label,
    styles,
    componentsProps,
    record,
    name,
    classNames,
    dataOptions,
    referenceTables,
    repeatable,
    children,
    dataAttributes,
    ...attributes
  } = props;

  const getOptions = () => {
    return dataOptions.map(option => ({
      value: option.value,
      label: intl.formatMessage({ id: option.label }),
    }));
  };

  let attrs = {
    label: label ? (<FormattedMessage id={label} />) : label,
    component: component ? getControl(component) : null,
    ...attributes,
    ...dataAttributes,
  };
  const classes = styles && classNames ? classNames.map(className => styles[className]).join(' ') : undefined;

  if (dataOptions && dataOptions.length) {
    attrs = {
      ...attrs,
      dataOptions: getOptions(),
    };
  }

  if (componentsProps[name]) {
    attrs = {
      ...attrs,
      ...componentsProps[name],
    };
  }

  const renderDefault = () => {
    const Cmp = (!isEmpty(record) && staticControlType) ? getControl(staticControlType) : getControl(controlType);

    if (hasChildren(props)) {
      return (
        <Cmp
          className={classes}
          {...attrs}
        >
          {children.map((cfg, i) => (
            <Control
              key={`control-${i}`}
              intl={intl}
              styles={styles}
              referenceTables={referenceTables}
              componentsProps={componentsProps}
              record={record}
              {...cfg}
            />
          ))}
        </Cmp>
      );
    }

    return <Cmp {...attrs} />;
  };

  const renderRepeatable = () => {
    const {
      legend,
      addLabel,
      fields,
      onAdd,
      onRemove,
    } = props;

    const Cmp = getControl(controlType);
    const Repeatable = getControl('RepeatableField');

    return (
      <Cmp
        className={classes}
        {...attrs}
      >
        <Repeatable
          legend={legend}
          addLabel={addLabel}
          fields={referenceTables[fields]}
          onAdd={onAdd}
          onRemove={onRemove}
          renderField={() => (
            <Fragment>
              {children.map((cfg, i) => (
                <Control
                  key={`control-${i}`}
                  intl={intl}
                  styles={styles}
                  referenceTables={referenceTables}
                  record={record}
                  {...cfg}
                />
              ))}
            </Fragment>
          )}
        />
      </Cmp>
    );
  };

  return (repeatable && isEmpty(componentsProps)) ? renderRepeatable() : renderDefault();
});

Control.propTypes = {
  controlType: PropTypes.string.isRequired,
  staticControlType: PropTypes.string,
  component: PropTypes.string,
  label: PropTypes.string || Node,
  intl: intlShape,
  styles: PropTypes.shape(PropTypes.string),
  classNames: PropTypes.arrayOf(PropTypes.string),
  dataOptions: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
  repeatable: PropTypes.bool,
  children: PropTypes.arrayOf(Node),
  dataAttributes: PropTypes.object,
  componentsProps: PropTypes.object,
  record: PropTypes.object,
  name: PropTypes.string,
  referenceTables: PropTypes.object,
};
