import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import {
  MARC_FIELD_PROTECTION_SOURCE,
  validateRequiredField,
} from '../../utils';

const validateField = value => {
  const checkFieldRange = () => {
    return value.length === 3 && parseInt(value, 10) >= 10 && parseInt(value, 10) <= 999;
  };

  if (value && (value === '*' || checkFieldRange())) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrNumeric" />;
};

const validateAlphanumeric = value => {
  const pattern = /^[*\w]$/;

  if (!value || value.match(pattern)) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrAlphanumeric" />;
};

const validateSubfield = (subfieldValue, fieldValue) => {
  let pattern = /^[*\w]$/;
  let errorMessage = <FormattedMessage id="ui-data-import.validation.enterAsteriskOrAlphanumeric" />;

  if (fieldValue === '*') {
    pattern = /^\w$/;
    errorMessage = <FormattedMessage id="ui-data-import.validation.valueType" />;
  }

  if (!subfieldValue || subfieldValue.match(pattern)) {
    return null;
  }

  return errorMessage;
};

const validateData = value => {
  if (value) {
    return null;
  }

  return <FormattedMessage id="ui-data-import.validation.enterAsteriskOrOther" />;
};

@injectIntl
@stripesConnect
export class MARCFieldProtection extends Component {
  static propTypes = {
    stripes: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressEdit = ({ source }) => source === MARC_FIELD_PROTECTION_SOURCE.SYSTEM.value;

  suppressDelete = ({ source }) => source === MARC_FIELD_PROTECTION_SOURCE.SYSTEM.value;

  validateFields = item => {
    const requiredFieldErrorMessage = <FormattedMessage id="stripes-core.label.missingRequiredField" />;

    return {
      field: validateField(item.field),
      indicator1: validateAlphanumeric(item.indicator1),
      indicator2: validateAlphanumeric(item.indicator2),
      subfield: validateRequiredField(item.subfield, requiredFieldErrorMessage) || validateSubfield(item.subfield, item.field),
      data: validateData(item.data),
    };
  };

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
    const hiddenFields = ['numberOfObjects', 'lastUpdated'];
    const visibleFields = ['field', 'indicator1', 'indicator2', 'subfield', 'data', 'source'];
    const readOnlyFields = ['source'];
    const actionSuppressor = {
      edit: this.suppressEdit,
      delete: this.suppressDelete,
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
        itemTemplate={{ source: 'USER' }}
        sortby="field"
        validate={this.validateFields}
        stripes={stripes}
      />
    );
  }
}
