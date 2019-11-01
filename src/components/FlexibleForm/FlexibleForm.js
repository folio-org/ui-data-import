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

import { IntlConsumer } from '@folio/stripes/core';
import * as stripesComponents from '@folio/stripes/components';
import * as components from '..';

const controls = {
  Field,
  ...stripesComponents,
};

const getControl = controlType => components[controlType] || controls[controlType];
const hasChildren = cfg => cfg.children && cfg.children.length;

export const Control = memo(props => {
  const {
    controlType,
    component,
    intl,
    label,
    styles,
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
  const classes = styles && classNames ? classNames.map(name => styles[name]).join(' ') : undefined;

  if (dataOptions && dataOptions.length) {
    attrs = {
      ...attrs,
      dataOptions: getOptions(),
    };
  }

  const renderDefault = () => {
    const Cmp = getControl(controlType);

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
          renderField={(field, index) => (
            <Fragment>
              {children.map((cfg, i) => (
                <Control
                  key={`control-${i}`}
                  intl={intl}
                  styles={styles}
                  referenceTables={referenceTables}
                  {...cfg}
                />
              ))}
            </Fragment>
          )}
        />
      </Cmp>
    );
  };

  return repeatable ? renderRepeatable() : renderDefault();
});

Control.propTypes = {
  controlType: PropTypes.string,
  component: PropTypes.string.isRequired,
  label: PropTypes.string || Node,
  intl: intlShape,
  styles: PropTypes.shape(PropTypes.string),
  classNames: PropTypes.arrayOf(PropTypes.string),
  dataOptions: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
  repeatable: PropTypes.bool,
  children: PropTypes.arrayOf(Node),
  dataAttributes: PropTypes.object,
};

export const FlexibleForm = memo(props => {
  const {
    component,
    config,
    config: { children },
    styles,
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
          {hasChildren(config) && children.map((cfg, i) => {
            return (
              <Control
                key={`control-${i}`}
                intl={intl}
                styles={styles}
                referenceTables={referenceTables}
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
  children: PropTypes.arrayOf(Node),
  dataAttributes: PropTypes.object,
};
