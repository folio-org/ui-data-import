import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import { CLOSING_REASONS_SOURCE } from '../../utils';

// TODO: Remove after connect to BE
const initialValues = {
  items: [{
    field: '001',
    indicator1: '',
    indicator2: '',
    subfield: '',
    data: '*',
    source: 'System',
  }, {
    field: '999',
    indicator1: 'f',
    indicator2: 'f',
    subfield: '*',
    data: '*',
    source: 'System',
  }],
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

  suppressEdit = ({ source }) => source === CLOSING_REASONS_SOURCE.system;

  suppressDelete = ({ source }) => source === CLOSING_REASONS_SOURCE.system;

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
        label={intl.formatMessage({ id: 'ui-data-import.settings.marcFieldProtection.title' })}
        labelSingular={<FormattedMessage id="ui-data-import.settings.marcFieldProtection.title" />}
        objectLabel={<FormattedMessage id="ui-data-import.settings.marcFieldProtection.title" />}
        listFormLabel={<FormattedMessage id="ui-data-import.settings.marcFieldProtection.listFormHeader" />}
        columnMapping={columnMapping}
        readOnlyFields={readOnlyFields}
        visibleFields={visibleFields}
        hiddenFields={hiddenFields}
        actionSuppressor={actionSuppressor}
        initialValues={initialValues}
        stripes={stripes}
      />
    );
  }
}
