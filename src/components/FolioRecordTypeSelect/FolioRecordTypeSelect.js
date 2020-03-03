import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import {
  identity,
  noop,
} from 'lodash';

import { Select } from '@folio/stripes/components';
import { validateRequiredField } from '../../utils';

export const FolioRecordTypeSelect = ({
  fieldName,
  dataOptions,
  onChange,
}) => (
  <div data-test-folio-record-type-field>
    <FormattedMessage id="ui-data-import.chooseFolioRecordType">
      {placeholder => (
        <Field
          label={<FormattedMessage id="ui-data-import.folioRecordType" />}
          name={`profile.${fieldName}`}
          component={Select}
          required
          itemToString={identity}
          validate={[validateRequiredField]}
          dataOptions={dataOptions}
          placeholder={placeholder}
          onChange={(e, value) => onChange(value)}
        />
      )}
    </FormattedMessage>
  </div>
);

FolioRecordTypeSelect.propTypes = {
  fieldName: PropTypes.string.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
};

FolioRecordTypeSelect.defaultProps = {
  dataOptions: [],
  onChange: noop,
};
