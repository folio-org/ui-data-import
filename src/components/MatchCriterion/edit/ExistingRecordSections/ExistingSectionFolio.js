import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import classnames from 'classnames';
import { last } from 'lodash';

import {
  Row,
  Col,
  Selection,
} from '@folio/stripes/components';

import {
  Section,
  FOLIO_RECORD_TYPES,
} from '../../..';

import {
  fieldsConfig,
  MARC_FIELD_CONSTITUENT,
  validateRequiredField,
} from '../../../../utils';

import css from '../MatchCriterions.css';

export const ExistingSectionFolio = ({
  repeatableIndex,
  existingRecordFieldLabel,
  existingRecordFields,
  existingRecordType,
  dispatchFormChange,
}) => {
  const fieldToChangeName = `profile.matchDetails[${repeatableIndex}].existingMatchExpression.fields[0].value`;

  const handleFieldSearch = (value, dataOptions) => {
    return dataOptions.filter(o => new RegExp(`${value}`, 'i').test(o.label));
  };

  const handleExistingRecordSelect = (event, newValue) => {
    event.preventDefault();

    const fieldToChange = `profile.matchDetails[${repeatableIndex}].existingMatchExpression.fields`;
    const fieldId = existingRecordFields.find(item => item.value === newValue)?.id;
    const fieldFromConfig = fieldsConfig.find(item => item.id === fieldId && item.recordType === existingRecordType);
    const fieldToChangeValue = [{
      label: MARC_FIELD_CONSTITUENT.FIELD,
      value: fieldFromConfig?.value,
    }];

    if (fieldFromConfig?.fromResources) {
      const { fromResources } = fieldFromConfig;

      fieldToChangeValue.push({
        label: fromResources.labelToSend,
        value: newValue,
      });
    }

    dispatchFormChange(fieldToChange, fieldToChangeValue);
  };

  const formatExistingRecordValue = useCallback(
    value => {
      if (!value) return '';

      const fieldValue = value[0].value;
      const fieldFromConfig = fieldsConfig.find(item => item.value === fieldValue && item.recordType === existingRecordType);

      if (fieldFromConfig?.fromResources) {
        return last(value).value;
      }

      const existingRecordField = existingRecordFields.find(item => item.id === fieldFromConfig?.id)?.value;

      return existingRecordField || '';
    },
    [existingRecordFields, existingRecordType],
  );

  return (
    <Section
      label={existingRecordFieldLabel}
      className={classnames(css.field, css.inputContainer)}
    >
      <Row>
        <Col xs={12}>
          <Field
            id="criterion-value-type"
            aria-label={existingRecordFieldLabel}
            component={Selection}
            name={fieldToChangeName}
            dataOptions={existingRecordFields}
            format={formatExistingRecordValue}
            onChange={handleExistingRecordSelect}
            onFilter={handleFieldSearch}
            validate={[validateRequiredField]}
          />
        </Col>
      </Row>
    </Section>
  );
};

ExistingSectionFolio.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)).isRequired,
  dispatchFormChange: PropTypes.func.isRequired,
  existingRecordFields: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  existingRecordFieldLabel: PropTypes.string,
};

ExistingSectionFolio.defaultProps = {
  existingRecordFields: null,
  existingRecordFieldLabel: '',
};
