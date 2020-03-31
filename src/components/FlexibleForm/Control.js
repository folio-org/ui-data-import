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
import * as stripesSmartComponents from '@folio/stripes/smart-components';

import * as components from '..';
import * as validators from '../../utils/formValidators';
import { checkEmpty } from '../../utils';

export const VIRTUAL_CONTROLS = { COMMON_SECTION: 'CommonSection' };

const controls = {
  FormattedMessage,
  Fragment,
  Field,
  ...stripesComponents,
  ...stripesSmartComponents,
};

const getControl = controlType => components[controlType] || controls[controlType] || controlType;
const getValidation = validation => validation.map(val => validators[val]);
const augmentParam = (param, splitter, augment) => (param ? param.split(splitter).join(augment) : param);
const getActualName = (name, sectionNamespace, repeatableIndex) => {
  const nsName = augmentParam(name, '**ns**', sectionNamespace);

  return augmentParam(nsName, '##ri##', repeatableIndex);
};
const isFormattedMessage = lbl => React.isValidElement(lbl);
const isTranslationId = lbl => lbl && lbl.includes('ui-');
const getOptions = (options, sectionNamespace, intl) => {
  return options.map(option => {
    let lbl = option.label;

    if (!isFormattedMessage(lbl) && isTranslationId(lbl)) {
      lbl = intl.formatMessage({ id: augmentParam(lbl, '**ns**', sectionNamespace) });
    }

    return {
      value: option.value,
      label: lbl,
    };
  });
};
const getOptionLabel = (options, label, sectionNamespace) => {
  const option = options.find(item => item.value === label);

  if (isEmpty(option)) {
    return undefined;
  }

  const isFMessage = isFormattedMessage(option.label);
  const isTranId = isTranslationId(option.label);

  if (isFMessage || (!isFMessage && !isTranId)) {
    return option.label;
  }

  const actualLabel = !isFMessage ? augmentParam(option.label, '**ns**', sectionNamespace) : option.label;

  return !isFormattedMessage ? <FormattedMessage id={actualLabel} /> : actualLabel;
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
    placeholder,
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
    setReferenceTables,
    initialFields,
    dataType,
    renderForbidden,
    ...attributes
  } = props;

  const isEditable = isEmpty(record);
  const classes = styles && classNames ? classNames.map(className => styles[className]).join(' ') : undefined;
  const children = optional && !isEditable && !hasContent(childControls, record, sectionNamespace, repeatableIndex) ? [] : childControls;
  const isFragment = (isEditable && controlType === 'Fragment') || (!isEditable && staticControlType === 'Fragment');

  const getAttributes = () => {
    const {
      name,
      fieldsPath,
      validate,
    } = props;

    const staticPrefix = staticNamespace && staticNamespace.length ? `${staticNamespace}.` : '';
    const editablePrefix = editableNamespace && editableNamespace.length ? `${editableNamespace}.` : '';
    const actualId = augmentParam(id, '**ns**', sectionNamespace);
    const actualName = getActualName(name, sectionNamespace, repeatableIndex);
    const fullName = `${isEditable ? editablePrefix : staticPrefix}${actualName}`;
    const fullFieldsPath = `${isEditable ? editablePrefix : staticPrefix}${fieldsPath}`;
    const actualLabel = augmentParam(label, '**ns**', sectionNamespace);

    let attrs = {
      component: component ? getControl(component) : null,
      id: actualId,
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
        fieldsPath: fullFieldsPath,
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

    if (injectedProps?.[actualId]) {
      attrs = {
        ...attrs,
        ...injectedProps[actualId],
      };
    }

    const actualDataOptions = injectedProps?.[actualId]?.dataOptions || dataOptions;

    if (!isEmpty(actualDataOptions)) {
      attrs = {
        ...attrs,
        dataOptions: getOptions(actualDataOptions, sectionNamespace, intl),
      };
    }

    if (record) {
      let actualRecord = record;

      if (!isEditable && controlType === 'Field') {
        let val = !attrs.value ? getValue(name, record, sectionNamespace, repeatableIndex) : attrs.value;

        if (typeof val === 'string') {
          val = val.trim();
        }

        let actualValue = checkEmpty(val) ? <stripesComponents.NoValue /> : checkDate(dataType, val);

        if (!isEmpty(attrs.dataOptions) && !isFormattedMessage(val)) {
          actualValue = getOptionLabel(attrs.dataOptions, val, sectionNamespace);
        }

        actualRecord = set(record, actualName, actualValue);
      }

      attrs = {
        ...attrs,
        record: actualRecord,
        value: get(record, actualName) || <stripesComponents.NoValue />,
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
              setReferenceTables={setReferenceTables}
              initialFields={initialFields}
              injectedProps={injectedProps}
              commonSections={commonSections}
              record={attribs.record}
              {...cfg}
            />
          ))}
        </Cmp>
      );
    }

    if (!isEmpty(placeholder)) {
      return !isFormattedMessage(placeholder) && isTranslationId(placeholder) ? (
        <FormattedMessage id={augmentParam(placeholder, '**ns**', sectionNamespace)}>
          {localized => (
            <Cmp
              placeholder={localized}
              {...attribs}
            />
          )}
        </FormattedMessage>
      ) : (
        <Cmp
          placeholder={placeholder}
          className={classes}
          {...attribs}
        />
      );
    }

    return (
      <Cmp {...attribs} />
    );
  };

  const renderRepeatable = () => {
    const {
      name,
      legend,
      addLabel,
      fields,
      canAdd,
      canRemove,
      incrementalField,
    } = props;
    const { fieldsPath } = attribs;

    const Cmp = getControl(controlType);
    const Repeatable = getControl('RepeatableField');

    if (isFragment) {
      return <Cmp />;
    }

    const refTable = get(referenceTables, fields, []);

    const onAdd = () => {
      let newInitRow = { ...get(initialFields, [name], {}) };

      if (!checkEmpty(incrementalField)) {
        newInitRow = {
          ...newInitRow,
          [incrementalField]: refTable.length,
        };
      }

      refTable.push(newInitRow);
      setReferenceTables(fieldsPath, refTable);
    };

    const onRemove = index => {
      refTable.splice(index, 1);

      let newRefTable = refTable;

      if (!checkEmpty(incrementalField)) {
        newRefTable = refTable.map((row, i) => ({
          ...row,
          [incrementalField]: i,
        }));
      }

      setReferenceTables(fieldsPath, newRefTable);
    };

    return (
      <Cmp
        className={classes}
        {...attribs}
      >
        <Repeatable
          legend={legend ? <FormattedMessage id={legend} /> : legend}
          addLabel={addLabel ? <FormattedMessage id={addLabel} /> : addLabel}
          fields={refTable}
          onAdd={onAdd}
          onRemove={onRemove}
          canAdd={canAdd}
          canRemove={canRemove}
          renderField={(field, index) => (
            <>
              {children.map((cfg, i) => (
                <Control
                  key={`control-${i}`}
                  repeatableIndex={field?.[incrementalField] || index}
                  staticNamespace={staticNamespace}
                  editableNamespace={editableNamespace}
                  sectionNamespace={sectionNamespace}
                  intl={intl}
                  styles={styles}
                  referenceTables={referenceTables}
                  setReferenceTables={setReferenceTables}
                  initialFields={initialFields}
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
    const sectionHasNoContent = isSectionComponent && isOptional && !isEditable && !hasContent(cc, record, sectionNS, ri);
    const sectionChildren = sectionHasNoContent ? [] : cc;
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
        setReferenceTables={setReferenceTables}
        initialFields={initialFields}
        injectedProps={injectedProps}
        commonSections={commonSections}
        record={attribs.record}
        {...sectionAttrs}
      />
    );
  };

  if (renderForbidden) {
    return <></>;
  }

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
  placeholder: PropTypes.string,
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
  initialFields: PropTypes.object,
  record: PropTypes.object,
  id: PropTypes.string,
  optional: PropTypes.bool,
  name: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.string),
  referenceTables: PropTypes.object,
  setReferenceTables: PropTypes.func,
  dataType: PropTypes.string,
  renderForbidden: PropTypes.bool,
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  addLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  fields: PropTypes.arrayOf(PropTypes.object),
  fieldsPath: PropTypes.string,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};
