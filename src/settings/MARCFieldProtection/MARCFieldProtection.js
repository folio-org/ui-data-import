import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  formValueSelector,
  change,
} from 'redux-form';
import {
  connect,
  batch,
} from 'react-redux';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { withStripes } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { TextField } from '@folio/stripes/components';

import { MARC_FIELD_PROTECTION_SOURCE } from '../../utils';

export const DISABLED_FOR_PROTECTING_FIELDS = ['Leader', 'LDR', '001', '002', '003', '004', '005', '009'];
export const DISABLED_FOR_SUBFIELD_AND_INDICATORS_FIELDS = ['006', '007', '008'];
export const DISABLED_FOR_F_INDICATOR_FIELD = '999';

const validateField = value => {
  const checkFieldRange = () => {
    return value.length === 3 && parseInt(value, 10) <= 999;
  };

  if (value && DISABLED_FOR_PROTECTING_FIELDS.every(field => field !== value) && (checkFieldRange() || value === '*')) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrOtherNumeric" />;
};
const validateAlphanumeric = value => {
  const pattern = /^[*\w]$/;

  if (!value || value.match(pattern)) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrAlphanumeric" />;
};
const validateIndicator = (indicatorValue, fieldValue, indicator2Value) => {
  const checkFieldRange = () => {
    return parseInt(fieldValue, 10) >= 10 && parseInt(fieldValue, 10) <= 998;
  };

  if (checkFieldRange() && !indicatorValue) {
    return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrAlphanumeric" />;
  }

  if (fieldValue === DISABLED_FOR_F_INDICATOR_FIELD && indicatorValue === 'f') {
    return <FormattedMessage id="ui-data-import.validation.enterOther" />;
  }

  if (fieldValue === DISABLED_FOR_F_INDICATOR_FIELD && indicatorValue === '*' && indicator2Value === '*') {
    return <FormattedMessage id="ui-data-import.validation.enterOther" />;
  }

  return validateAlphanumeric(indicatorValue);
};
const validateSubfield = (subfieldValue, fieldValue) => {
  let pattern = /^[*\w]$/;
  let errorMessage = <FormattedMessage id="ui-data-import.validation.enterAsteriskOrAlphanumeric" />;
  const isSubfieldRequired = DISABLED_FOR_SUBFIELD_AND_INDICATORS_FIELDS.every(field => field !== fieldValue);

  const checkFieldRange = () => {
    return parseInt(fieldValue, 10) >= 10 && parseInt(fieldValue, 10) <= 998;
  };

  if (checkFieldRange() && !subfieldValue) {
    return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrAlphanumeric" />;
  }

  if (isSubfieldRequired && !subfieldValue) {
    return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
  }

  if (subfieldValue && fieldValue === '*') {
    pattern = /^\w$/;
    errorMessage = <FormattedMessage id="ui-data-import.validation.valueType" />;
  }

  if (isSubfieldRequired && !subfieldValue.match(pattern)) {
    return errorMessage;
  }

  return null;
};
const validateData = (dataValue, fieldValue) => {
  const isAsteriskDisabled = DISABLED_FOR_SUBFIELD_AND_INDICATORS_FIELDS.some(field => field === fieldValue);

  if (isAsteriskDisabled && dataValue === '*') {
    return <FormattedMessage id="ui-data-import.validation.enterOther" />;
  }

  if (isAsteriskDisabled && !dataValue) {
    return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
  }

  if (!dataValue) {
    return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrOther" />;
  }

  return null;
};

const mapDispatchToProps = dispatch => ({
  resetDisabledFields: () => {
    batch(() => {
      dispatch(change('editableListForm', 'items[0].indicator1', ''));
      dispatch(change('editableListForm', 'items[0].indicator2', ''));
      dispatch(change('editableListForm', 'items[0].subfield', ''));
      dispatch(change('editableListForm', 'items[0].data', ''));
    });
  },
});
const selectFormValues = state => {
  const selector = formValueSelector('editableListForm');

  return { formValues: selector(state, 'items') };
};

@injectIntl
@withStripes
@connect(selectFormValues, mapDispatchToProps)
export class MARCFieldProtection extends Component {
  static propTypes = {
    stripes: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    formValues: PropTypes.arrayOf(PropTypes.object),
    resetDisabledFields: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.getFieldComponents = this.getFieldComponents.bind(this);
  }

  suppressEdit = ({ source }) => source === MARC_FIELD_PROTECTION_SOURCE.SYSTEM.value;

  suppressDelete = ({ source }) => source === MARC_FIELD_PROTECTION_SOURCE.SYSTEM.value;

  getFieldComponents = () => {
    const newFieldProtection = this.props.formValues?.[0];

    const disabledFieldElement = ({
      fieldProps,
      name,
    }) => (
      <Field
        {...fieldProps}
        component={TextField}
        marginBottom0
        fullWidth
        placeholder={name}
        disabled={DISABLED_FOR_SUBFIELD_AND_INDICATORS_FIELDS.some(field => field === newFieldProtection?.field)}
      />
    );

    const fieldElement = ({
      fieldProps,
      name,
    }) => (
      <Field
        {...fieldProps}
        component={TextField}
        marginBottom0
        fullWidth
        placeholder={name}
        onChange={(e, newValue) => {
          if (DISABLED_FOR_SUBFIELD_AND_INDICATORS_FIELDS.some(field => field === newValue)) {
            this.props.resetDisabledFields();
          }
        }}
      />
    );

    return ({
      field: fieldElement,
      indicator1: disabledFieldElement,
      indicator2: disabledFieldElement,
      subfield: disabledFieldElement,
    });
  };

  validateFields = ({
    field,
    indicator1,
    indicator2,
    subfield,
    data,
  }) => ({
    field: validateField(field),
    indicator1: validateIndicator(indicator1, field, indicator2),
    indicator2: validateIndicator(indicator2, field, indicator1),
    subfield: validateSubfield(subfield, field),
    data: validateData(data, field),
  });

  render() {
    const {
      intl,
      stripes,
    } = this.props;

    const columnMapping = {
      field: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.field" />,
      indicator1: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.indicator1" />,
      indicator2: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.indicator2" />,
      subfield: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.subfield" />,
      data: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.data" />,
      source: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.source" />,
      actions: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.actions" />,
    };
    const formatter = {
      source: ({ source }) => {
        const sourceLabelId = MARC_FIELD_PROTECTION_SOURCE[source]?.labelId;

        return sourceLabelId && <FormattedMessage id={sourceLabelId} />;
      },
    };
    const readOnlyFields = ['source'];
    const visibleFields = ['field', 'indicator1', 'indicator2', 'subfield', 'data', 'source'];
    const hiddenFields = ['numberOfObjects', 'lastUpdated'];
    const actionSuppressor = {
      edit: this.suppressEdit,
      delete: this.suppressDelete,
    };
    const itemTemplate = {
      indicator1: '*',
      indicator2: '*',
      subfield: '*',
      data: '*',
      source: 'USER',
    };

    return (
      <this.connectedControlledVocab
        id="marc-field-protection"
        baseUrl="field-protection-settings/marc"
        records="marcFieldProtectionSettings"
        label={intl.formatMessage({ id: 'ui-data-import.settings.marcFieldProtection.title' })}
        labelSingular={<FormattedMessage id="ui-data-import.settings.marcFieldProtection.title" />}
        objectLabel={<FormattedMessage id="ui-data-import.settings.marcFieldProtection.title" />}
        listFormLabel={<FormattedMessage id="ui-data-import.settings.marcFieldProtection.listFormHeader" />}
        columnMapping={columnMapping}
        formatter={formatter}
        readOnlyFields={readOnlyFields}
        visibleFields={visibleFields}
        hiddenFields={hiddenFields}
        actionSuppressor={actionSuppressor}
        itemTemplate={itemTemplate}
        sortby="field"
        validate={this.validateFields}
        stripes={stripes}
        fieldComponents={this.getFieldComponents()}
      />
    );
  }
}
