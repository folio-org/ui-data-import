import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { identity } from 'lodash';

import { Select } from '@folio/stripes/components';
import { validateRequiredField } from '../../utils';

export const FolioRecordTypeSelect = ({ dataOptions }) => (
  <div data-test-folio-record-type-field>
    <FormattedMessage id="ui-data-import.chooseFolioRecordType">
      {placeholder => (
        <Field
          label={<FormattedMessage id="ui-data-import.folioRecordType" />}
          name="folioRecord"
          component={Select}
          required
          itemToString={identity}
          validate={[validateRequiredField]}
          dataOptions={dataOptions}
          placeholder={placeholder}
        />
      )}
    </FormattedMessage>
  </div>
);

FolioRecordTypeSelect.propTypes = { dataOptions: PropTypes.arrayOf(PropTypes.object) };
