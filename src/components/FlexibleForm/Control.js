import React, {
  Fragment,
  memo,
} from 'react';
import { FormattedMessage } from 'react-intl';
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
import {
  getValidation,
  augmentParam,
  isFormattedMessage,
  isTranslationId,
  getOptionLabel,
  checkDate,
  checkEmpty,
  getDecoratorValue,
} from '../../utils';

import * as decorators from './ControlDecorators';

export const VIRTUAL_CONTROLS = { COMMON_SECTION: 'CommonSection' };

const controls = {
  FormattedMessage,
  Fragment,
  Field,
  ...stripesComponents,
  ...stripesSmartComponents,
};

const getControl = controlType => components[controlType] || controls[controlType] || controlType;
const getActualParam = (param, sectionNamespace, repeatableIndex) => {
  const nsParam = augmentParam(param, '**ns**', sectionNamespace);

  return augmentParam(nsParam, '##ri##', repeatableIndex);
};
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
const getChildrenWithName = children => {
  const childrenWithName = [];

  const getChildren = items => items?.forEach(item => (item.name ? childrenWithName.push(item) : getChildren(item.childControls)));

  getChildren(children);

  return childrenWithName;
};
const getValue = (controlName, record, sectionNamespace, repeatableIndex) => get(record, getActualParam(controlName, sectionNamespace, repeatableIndex));
const hasChildren = cfg => cfg.childControls && cfg.childControls.length;
const hasContent = (children, record, sectionNamespace, repeatableIndex) => getChildrenWithName(children)
  .map(child => getValue(child.name, record, sectionNamespace, repeatableIndex))
  .some(child => child !== undefined && child !== ' ' && child !== '-');

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
    okapi,
    referenceTables,
    setReferenceTables,
    initialFields,
    dataType,
    renderForbidden,
    enabled,
    ...attributes
  } = props;

  const isEditable = isEmpty(record);
  const classes = styles && classNames ? classNames.map(className => styles[className]).join(' ') : undefined;
  const children = optional && !isEditable && !hasContent(childControls, record, sectionNamespace, repeatableIndex) ? [] : childControls;
  const isFragment = (isEditable && controlType === 'Fragment') || (!isEditable && staticControlType === 'Fragment');
  const noValueComponent = enabled ? <stripesComponents.NoValue /> : <components.ProhibitionIcon />;
  const staticPrefix = staticNamespace && staticNamespace.length ? `${staticNamespace}.` : '';
  const editablePrefix = editableNamespace && editableNamespace.length ? `${editableNamespace}.` : '';

  const getAttributes = () => {
    const {
      name,
      fieldsPath,
      validate,
      decorator,
    } = props;

    const actualId = getActualParam(id, sectionNamespace, repeatableIndex);
    const actualName = getActualParam(name, sectionNamespace, repeatableIndex);
    const fullName = `${isEditable ? editablePrefix : staticPrefix}${actualName}`;
    const fullFieldsPath = `${isEditable ? editablePrefix : staticPrefix}${fieldsPath}`;
    const actualLabel = augmentParam(label, '**ns**', sectionNamespace);

    let attrs = {
      id: actualId,
      label: actualLabel ? (<FormattedMessage id={actualLabel} />) : actualLabel,
      optional,
      sectionNamespace,
      repeatableIndex,
      record,
      okapi,
      ...attributes,
      ...dataAttributes,
    };

    if (name && name.length) {
      attrs = {
        ...attrs,
        name: fullName,
        fieldsPath: getActualParam(fullFieldsPath, sectionNamespace, repeatableIndex),
      };
    }

    if (validate && validate.length) {
      attrs = {
        ...attrs,
        validate: getValidation(validate),
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

        let actualValue = checkEmpty(val) ? noValueComponent : checkDate(dataType, val);

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

    if (component) {
      const control = component ? getControl(component) : null;
      let wrapper = null;

      if (control && decorator) {
        wrapper = decorators[decorator];
        attrs = {
          ...attrs,
          value: getDecoratorValue(attrs?.value) || noValueComponent,
        };
      }

      attrs = {
        ...attrs,
        component: wrapper || control,
        WrappedComponent: wrapper ? control : null,
        setAcceptedValues: data => setReferenceTables(attrs.fieldsPath, data),
      };
    }

    return attrs;
  };

  const attribs = getAttributes();

  const renderChildren = () => children.map((cfg, i) => (
    <Control
      key={`control-${i}`}
      repeatableIndex={cfg.repeatable ? i : repeatableIndex}
      staticNamespace={staticNamespace}
      editableNamespace={editableNamespace}
      sectionNamespace={sectionNamespace}
      intl={intl}
      styles={styles}
      okapi={okapi}
      referenceTables={referenceTables}
      setReferenceTables={setReferenceTables}
      initialFields={initialFields}
      injectedProps={injectedProps}
      commonSections={commonSections}
      record={attribs.record}
      {...cfg}
    />
  ));

  const renderMCL = contentData => {
    const {
      legend,
      visibleColumns,
      columnWidths,
      columnMapping,
      mclColumnPaths,
    } = props;

    const data = isEmpty(mclColumnPaths) ? contentData : (contentData.map(row => {
      let currentRow = {};

      visibleColumns.forEach(col => {
        const colPaths = mclColumnPaths[col];
        const fieldName = get(row, colPaths.namePath, col);
        const fieldValue = get(row, colPaths.valuePath);

        currentRow = {
          ...currentRow,
          [fieldName]: getDecoratorValue(fieldValue),
        };
      });

      return currentRow;
    }));
    const listData = !isEmpty(data) ? data : [{}];

    let mapping = {};
    let formatter = {};

    Object.keys(columnMapping).forEach(key => {
      const mapValue = columnMapping[key];

      mapping = {
        ...mapping,
        [key]: isTranslationId(mapValue) ? <FormattedMessage id={mapValue} /> : mapValue,
      };

      formatter = {
        ...formatter,
        [key]: x => x?.[key] || noValueComponent,
      };
    });

    return (
      <>
        <div>
          <strong>{isTranslationId(legend) ? <FormattedMessage id={legend} /> : legend}</strong>
        </div>
        <stripesComponents.MultiColumnList
          contentData={listData}
          visibleColumns={visibleColumns}
          columnWidths={columnWidths}
          columnMapping={mapping}
          formatter={formatter}
        />
        <br />
      </>
    );
  };

  const renderDefault = () => {
    const Cmp = !isEditable ? getControl(staticControlType) : getControl(controlType);

    if (isFragment) {
      return <Cmp />;
    }

    const {
      fields,
      renderStaticAsMCL,
    } = props;
    const refTable = get(referenceTables, fields, []);

    if (repeatable && renderStaticAsMCL) {
      return (
        <Cmp
          className={classes}
          {...attribs}
        >
          {renderMCL(refTable)}
        </Cmp>
      );
    }

    if (hasChildren(props)) {
      return (
        <Cmp
          className={classes}
          {...attribs}
        >
          {repeatable ? refTable.map(() => renderChildren()) : renderChildren()}
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
          {...attribs}
        />
      );
    }

    return (
      <Cmp
        {...attribs}
        intl={intl}
      />
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
      decorator,
      wrapperLabel,
      wrapperFieldName,
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

    let Wrapper = null;
    let fieldName = null;

    if (decorator) {
      Wrapper = decorators[decorator];
      fieldName = `${isEditable ? editablePrefix : staticPrefix}${getActualParam(wrapperFieldName, sectionNamespace, repeatableIndex)}`;
    }

    const Template = (
      <Repeatable
        legend={!Wrapper && (legend ? <FormattedMessage id={legend} /> : legend)}
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
                repeatableIndex={index}
                staticNamespace={staticNamespace}
                editableNamespace={editableNamespace}
                sectionNamespace={sectionNamespace}
                intl={intl}
                styles={styles}
                okapi={okapi}
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
    );

    return (
      <Cmp
        className={classes}
        {...attribs}
      >
        {Wrapper ? (
          <Wrapper
            intl={intl}
            enabled={enabled}
            legend={legend}
            referenceTable={refTable}
            wrapperLabel={wrapperLabel}
            wrapperFieldName={fieldName}
          >
            {Template}
          </Wrapper>
        ) : (
          <>{Template}</>
        )}
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
        optional: isEditable,
        isOpen: hasData,
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
        okapi={okapi}
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
  enabled: PropTypes.bool,
  editableNamespace: PropTypes.string,
  component: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, Node]),
  decorator: PropTypes.string,
  wrapperLabel: PropTypes.string,
  wrapperSources: PropTypes.arrayOf(PropTypes.object),
  wrapperSourcesFn: PropTypes.string,
  placeholder: PropTypes.string,
  intl: PropTypes.object,
  okapi: PropTypes.object,
  styles: PropTypes.shape(PropTypes.string),
  classNames: PropTypes.arrayOf(PropTypes.string),
  dataOptions: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
  repeatable: PropTypes.bool,
  repeatableIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  renderStaticAsMCL: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  columnWidths: PropTypes.objectOf(PropTypes.string),
  columnMapping: PropTypes.objectOf(PropTypes.string),
  mclColumnPaths: PropTypes.objectOf(
    PropTypes.shape({
      namePath: PropTypes.string,
      valuePath: PropTypes.string,
    }),
  ),
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

Control.defaultProps = { enabled: true };
