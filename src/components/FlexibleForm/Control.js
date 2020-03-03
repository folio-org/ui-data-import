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

import {
  isEmpty,
  get,
} from 'lodash';

import * as stripesComponents from '@folio/stripes/components';

import * as components from '..';
import * as validators from '../../utils/formValidators';

export const VIRTUAL_CONTROLS = { COMMON_SECTION: 'CommonSection' };

const controls = {
  FormattedMessage,
  Fragment,
  Field,
  ...stripesComponents,
};

const getControl = controlType => components[controlType] || controls[controlType] || controlType;
const getValidation = validation => validation.map(val => validators[val]);
const hasChildren = cfg => cfg.childControls && cfg.childControls.length;
const hasContent = (children, record) => children
  .map(child => get(record, child.name))
  .some(child => child !== undefined && child !== '-');

export const Control = memo(props => {
  const {
    staticNamespace,
    editableNamespace,
    controlType,
    staticControlType,
    component,
    label,
    intl,
    styles,
    classNames,
    dataOptions,
    repeatable,
    repeatableIndex,
    sectionNamespace,
    commonSections,
    childControls,
    dataAttributes,
    componentsProps,
    record,
    id,
    optional,
    referenceTables,
    ...attributes
  } = props;

  const isEditable = isEmpty(record);
  const classes = styles && classNames ? classNames.map(className => styles[className]).join(' ') : undefined;
  const children = optional && !isEditable && !hasContent(childControls, record) ? [] : childControls;
  const isFragment = (isEditable && controlType === 'Fragment') || (!isEditable && staticControlType === 'Fragment');

  const getOptions = options => {
    return options.map(option => {
      const lbl = option.label;

      return {
        value: option.value,
        label: intl.formatMessage({ id: lbl && sectionNamespace ? lbl.split('**ns**').join(sectionNamespace) : lbl }),
      };
    });
  };

  const getActualName = name => {
    const nsName = name && sectionNamespace ? name.split('**ns**').join(sectionNamespace) : name;

    return nsName && repeatableIndex >= 0 ? nsName.split('##ri##').join(repeatableIndex) : nsName;
  };

  const getAttributes = () => {
    const {
      name,
      validate,
    } = props;

    const staticPrefix = staticNamespace && staticNamespace.length ? `${staticNamespace}.` : '';
    const editablePrefix = editableNamespace && editableNamespace.length ? `${editableNamespace}.` : '';
    const actualId = id && sectionNamespace ? id.split('**ns**').join(sectionNamespace) : id;
    const actualName = getActualName(name);
    const fullName = `${isEditable ? editablePrefix : staticPrefix}${actualName}`;
    const actualLabel = label && sectionNamespace ? label.split('**ns**').join(sectionNamespace) : label;

    let attrs = {
      component: component ? getControl(component) : null,
      id: actualId,
      label: actualLabel ? (<FormattedMessage id={actualLabel} />) : actualLabel,
      optional,
      sectionNamespace,
      repeatableIndex,
      ...attributes,
      ...dataAttributes,
    };

    if (name && name.length) {
      attrs = {
        ...attrs,
        name: fullName,
      };
    }

    if (dataOptions && dataOptions.length) {
      attrs = {
        ...attrs,
        dataOptions: getOptions(dataOptions),
      };
    }

    if (record && get(record, actualName)) {
      attrs = {
        ...attrs,
        value: get(record, actualName, '-'),
      };
    }

    if (validate && validate.length) {
      attrs = {
        ...attrs,
        validate: getValidation(validate),
      };
    }

    if (optional) {
      attrs = {
        ...attrs,
        optional: !!isEditable,
        enabled: !!(isEditable && hasContent(children, referenceTables)),
      };
    }
    // if (componentsProps && componentsProps[id])
    if (componentsProps[actualId]) {
      attrs = {
        ...attrs,
        ...componentsProps[actualId],
      };
    }

    return attrs;
  };

  const attribs = getAttributes();

  const renderDefault = () => {
    const Cmp = !isEditable ? getControl(staticControlType) : getControl(controlType);

    if (isFragment) {
      return <Cmp />;
    }

    if (hasChildren(props)) {
      return (
        <Cmp
          className={classes}
          {...attribs}
        >
          {children.map((cfg, i) => (
            <Control
              key={`control-${i}`}
              repeatableIndex={repeatableIndex}
              staticNamespace={staticNamespace}
              editableNamespace={editableNamespace}
              sectionNamespace={sectionNamespace}
              intl={intl}
              styles={styles}
              referenceTables={referenceTables}
              componentsProps={componentsProps}
              commonSections={commonSections}
              record={record}
              {...cfg}
            />
          ))}
        </Cmp>
      );
    }

    return <Cmp {...attribs} />;
  };

  const renderRepeatable = () => {
    const {
      legend,
      addLabel,
    } = props;

    const Cmp = getControl(controlType);
    const Repeatable = getControl('RepeatableField');
    const getLegend = () => (legend ? intl.formatMessage({ id: legend }) : undefined);
    const getAddLabel = () => (addLabel ? intl.formatMessage({ id: addLabel }) : undefined);

    if (isFragment) {
      return <Cmp />;
    }

    return (
      <Cmp
        className={classes}
      >
        <Repeatable
          {...attribs}
          legend={getLegend()}
          addLabel={getAddLabel()}
          // fields={referenceTables[fields]}
          renderField={() => (
            <Fragment>
              {children.map((cfg, i) => (
                <Control
                  key={`control-${i}`}
                  repeatableIndex={i}
                  staticNamespace={staticNamespace}
                  editableNamespace={editableNamespace}
                  sectionNamespace={sectionNamespace}
                  intl={intl}
                  styles={styles}
                  referenceTables={referenceTables}
                  componentsProps={componentsProps}
                  commonSections={commonSections}
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

  const renderCommonSection = () => {
    const {
      sectionNamespace: sectionNS,
      stateFieldValue,
      acceptedSections,
      repeatableIndex: ri,
    } = attribs;

    const currentSection = commonSections.find(item => item.sectionKey === acceptedSections[stateFieldValue]);

    if (!currentSection?.controlType) {
      return <>&nbsp;</>;
    }

    return (
      <Control
        intl={intl}
        styles={styles}
        staticNamespace={staticNamespace}
        repeatableIndex={ri}
        editableNamespace={editableNamespace}
        sectionNamespace={sectionNS}
        referenceTables={referenceTables}
        componentsProps={componentsProps}
        commonSections={commonSections}
        record={record}
        {...currentSection}
      />
    );
  };

  if (controlType === VIRTUAL_CONTROLS.COMMON_SECTION) {
    return renderCommonSection();
  }

  return (repeatable && isEditable) ? renderRepeatable() : renderDefault();
});

Control.propTypes = {
  controlType: PropTypes.string.isRequired,
  staticControlType: PropTypes.string.isRequired,
  staticNamespace: PropTypes.string,
  editableNamespace: PropTypes.string,
  component: PropTypes.string,
  label: PropTypes.string || Node,
  intl: intlShape,
  styles: PropTypes.shape(PropTypes.string),
  classNames: PropTypes.arrayOf(PropTypes.string),
  dataOptions: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
  repeatable: PropTypes.bool,
  repeatableIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sectionNamespace: PropTypes.string,
  commonSections: PropTypes.arrayOf(PropTypes.object),
  childControls: PropTypes.arrayOf(Node),
  dataAttributes: PropTypes.object,
  componentsProps: PropTypes.object,
  record: PropTypes.object,
  id: PropTypes.string,
  optional: PropTypes.bool,
  name: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.string),
  referenceTables: PropTypes.object,
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  addLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  // fields: PropTypes.arrayOf(PropTypes.object),
};
