import React, {
  Fragment,
  memo,
} from 'react';
import {
  FormattedMessage,
  FormattedDate,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  isEmpty,
  get,
  set,
} from 'lodash';

import * as stripesComponents from '@folio/stripes/components';

import * as components from '..';
import * as validators from '../../utils/formValidators';
import { checkEmpty } from '../../utils';

export const VIRTUAL_CONTROLS = { COMMON_SECTION: 'CommonSection' };

const controls = {
  FormattedMessage,
  Fragment,
  Field,
  ...stripesComponents,
};

const getControl = controlType => components[controlType] || controls[controlType];
const getValidation = validation => validation.map(val => validators[val]);
const augmentParam = (param, placeholder, augment) => (param ? param.split(placeholder).join(augment) : param);
const getActualName = (name, sectionNamespace, repeatableIndex) => {
  const nsName = augmentParam(name, '**ns**', sectionNamespace);

  return augmentParam(nsName, '##ri##', repeatableIndex);
};
const getOptions = (options, sectionNamespace, intl) => {
  return options.map(option => {
    const lbl = option.label;

    return {
      value: option.value,
      label: intl.formatMessage({ id: augmentParam(lbl, '**ns**', sectionNamespace) }),
    };
  });
};
const getOptionLabel = (options, label, sectionNamespace) => {
  const option = options.find(item => item.value === label);

  if (isEmpty(option)) {
    return undefined;
  }

  const actualLabel = augmentParam(option.label, '**ns**', sectionNamespace);

  return !isEmpty(option) ? <FormattedMessage id={actualLabel} /> : undefined;
};
const getValue = (controlName, record, sectionNamespace, repeatableIndex) => get(record, getActualName(controlName, sectionNamespace, repeatableIndex));
const hasChildren = cfg => cfg.childControls && cfg.childControls.length;
const hasContent = (children, record, sectionNamespace, repeatableIndex) => children
  .map(child => getValue(child.name, record, sectionNamespace, repeatableIndex))
  .some(child => child !== undefined && child !== ' ' && child !== '-');
const checkDate = (dataType, value) => {
  const isDate = dataType === 'date';

  return isDate ? <FormattedDate value={value} /> : value;
};

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
    injectedProps,
    record,
    id,
    optional,
    referenceTables,
    dataType,
    ...attributes
  } = props;

  const isEditable = isEmpty(record);
  const classes = styles && classNames ? classNames.map(className => styles[className]).join(' ') : undefined;
  const children = optional && !isEditable && !hasContent(childControls, record, sectionNamespace, repeatableIndex) ? [] : childControls;
  const isFragment = (isEditable && controlType === 'Fragment') || (!isEditable && staticControlType === 'Fragment');

  const getAttributes = () => {
    const {
      name,
      validate,
    } = props;

    const staticPrefix = staticNamespace && staticNamespace.length ? `${staticNamespace}.` : '';
    const editablePrefix = editableNamespace && editableNamespace.length ? `${editableNamespace}.` : '';
    const actualId = augmentParam(id, '**ns**', sectionNamespace);
    const actualName = getActualName(name, sectionNamespace, repeatableIndex);
    const fullName = `${isEditable ? editablePrefix : staticPrefix}${actualName}`;
    const actualLabel = augmentParam(label, '**ns**', sectionNamespace);

    let attrs = {
      component: component ? getControl(component) : null,
      id: actualId,
      name: actualName,
      label: actualLabel ? (<FormattedMessage id={actualLabel} />) : actualLabel,
      optional,
      sectionNamespace,
      repeatableIndex,
      record,
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
        dataOptions: getOptions(dataOptions, sectionNamespace, intl),
      };
    }

    if (record) {
      let actualRecord = record;

      if (!isEditable && controlType === 'Field') {
        let val = getValue(name, record, sectionNamespace, repeatableIndex);

        if (typeof val === 'string') {
          val = val.trim();
        }

        let actualValue = checkEmpty(val) ? <stripesComponents.NoValue /> : checkDate(dataType, val);

        if (dataOptions && dataOptions.length && !React.isValidElement(val)) {
          actualValue = getOptionLabel(dataOptions, val, sectionNamespace);
        }

        actualRecord = set(record, actualName, actualValue);
      }

      attrs = {
        ...attrs,
        record: actualRecord,
        value: get(record, actualName) || <stripesComponents.NoValue />,
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
        enabled: !!(isEditable && hasContent(children, referenceTables, sectionNamespace, repeatableIndex)),
      };
    }

    if (injectedProps[actualId]) {
      attrs = {
        ...attrs,
        ...injectedProps[actualId],
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
              repeatableIndex={cfg.repeatable ? i : repeatableIndex}
              staticNamespace={staticNamespace}
              editableNamespace={editableNamespace}
              sectionNamespace={sectionNamespace}
              intl={intl}
              styles={styles}
              referenceTables={referenceTables}
              injectedProps={injectedProps}
              commonSections={commonSections}
              record={attribs.record}
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
      fields,
      onAdd,
      onRemove,
    } = props;

    const Cmp = getControl(controlType);
    const Repeatable = getControl('RepeatableField');

    if (isFragment) {
      return <Cmp />;
    }

    return (
      <Cmp
        className={classes}
        {...attribs}
      >
        <Repeatable
          legend={legend}
          addLabel={addLabel}
          fields={referenceTables[fields]}
          onAdd={onAdd}
          onRemove={onRemove}
          renderField={() => (
            <>
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
                  injectedProps={injectedProps}
                  commonSections={commonSections}
                  record={attribs.record}
                  {...cfg}
                />
              ))}
            </>
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
      return <></>;
    }

    const {
      childControls: cc = [],
      optional: isOptional,
    } = currentSection;

    const isSectionComponent = currentSection.controlType === 'Section';
    const sectionChildren = isSectionComponent && isOptional && !isEditable && !hasContent(cc, record, sectionNS, ri) ? [] : cc;
    const hasData = hasContent(sectionChildren, referenceTables, sectionNS, ri);

    let sectionAttrs = { ...currentSection };

    if (isSectionComponent && currentSection.optional) {
      sectionAttrs = {
        ...sectionAttrs,
        optional: !!isEditable,
        enabled: !!(isEditable && hasData),
      };
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
        injectedProps={injectedProps}
        commonSections={commonSections}
        record={attribs.record}
        {...sectionAttrs}
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
  injectedProps: PropTypes.object,
  record: PropTypes.object,
  id: PropTypes.string,
  optional: PropTypes.bool,
  name: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.string),
  referenceTables: PropTypes.object,
  dataType: PropTypes.string,
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  addLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  fields: PropTypes.arrayOf(PropTypes.object),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};
