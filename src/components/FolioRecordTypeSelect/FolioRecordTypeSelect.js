import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { noop } from 'lodash';

import { Select } from '@folio/stripes/components';
import {
  isFieldPristine,
  validateRequiredField,
} from '../../utils';

export const FolioRecordTypeSelect = ({
  fieldName,
  dataOptions,
  onRecordSelect,
}) => (
  <div data-test-folio-record-type-field>
    <FormattedMessage id="ui-data-import.chooseFolioRecordType">
      {([placeholder]) => (
        <Field
          name={`profile.${fieldName}`}
          validate={validateRequiredField}
          isEqual={isFieldPristine}
          render={fieldProps => (
            <Select
              {...fieldProps}
              data-testid="folio-record-type-select"
              label={<FormattedMessage id="ui-data-import.folioRecordType" />}
              dataOptions={dataOptions}
              placeholder={placeholder}
              onChange={event => {
                const value = event.target.value;

                fieldProps.input.onChange(value);
                onRecordSelect(value);
              }}
              required
            />
          )}
        />
      )}
    </FormattedMessage>
  </div>
);

FolioRecordTypeSelect.propTypes = {
  fieldName: PropTypes.string.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  onRecordSelect: PropTypes.func,
};

FolioRecordTypeSelect.defaultProps = { onRecordSelect: noop };
