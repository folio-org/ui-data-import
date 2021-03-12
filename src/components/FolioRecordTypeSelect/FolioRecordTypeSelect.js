import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field as FieldReduxForm } from 'redux-form';
import { Field as FieldFinalForm } from 'react-final-form';
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
  formType,
}) => {
  // TODO: Remove this after UIDATIMP-826 is done
  const FolioRecordTypeSelectReduxForm = (
    <div data-test-folio-record-type-field>
      <FormattedMessage id="ui-data-import.chooseFolioRecordType">
        {([placeholder]) => (
          <FieldReduxForm
            label={<FormattedMessage id="ui-data-import.folioRecordType" />}
            name={`profile.${fieldName}`}
            component={Select}
            required
            validate={[validateRequiredField]}
            dataOptions={dataOptions}
            placeholder={placeholder}
            onChange={onRecordSelect}
          />
        )}
      </FormattedMessage>
    </div>
  );
  const FolioRecordTypeSelectFinalForm = (
    <div data-test-folio-record-type-field>
      <FormattedMessage id="ui-data-import.chooseFolioRecordType">
        {([placeholder]) => (
          <FieldFinalForm
            name={`profile.${fieldName}`}
            validate={validateRequiredField}
            isEqual={isFieldPristine}
            render={fieldProps => (
              <Select
                {...fieldProps}
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

  return formType === 'redux-form' ? FolioRecordTypeSelectReduxForm : FolioRecordTypeSelectFinalForm;
};

FolioRecordTypeSelect.propTypes = {
  fieldName: PropTypes.string.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  onRecordSelect: PropTypes.func,
  formType: PropTypes.oneOf(['redux-form', 'final-form']), // TODO: Remove this prop after UIDATIMP-826 is done
};

FolioRecordTypeSelect.defaultProps = {
  onRecordSelect: noop,
  formType: 'final-form',
};
