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
  MARC_FIELD_PROTECTION_ALLOWED_FIELD_VALUES,
} from '../../utils';

const validateField = value => {
  const checkFieldRange = () => {
    return value.length === 3 && parseInt(value, 10) >= 10 && parseInt(value, 10) <= 999;
  };

  if (value && (MARC_FIELD_PROTECTION_ALLOWED_FIELD_VALUES.includes(value) || checkFieldRange())) {
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

  if (!subfieldValue) {
    errorMessage = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
  }

  if (subfieldValue && fieldValue === '*') {
    pattern = /^\w$/;
    errorMessage = <FormattedMessage id="ui-data-import.validation.valueType" />;
  }

  if (subfieldValue.match(pattern)) {
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

  validateFields = item => ({
    field: validateField(item.field),
    indicator1: validateAlphanumeric(item.indicator1),
    indicator2: validateAlphanumeric(item.indicator2),
    subfield: validateSubfield(item.subfield, item.field),
    data: validateData(item.data),
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
      />
    );
  }
}
