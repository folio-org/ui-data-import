import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
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
} from '../../../../utils';

import css from '../MatchCriterions.css';

export const ExistingSectionFolio = ({
  repeatableIndex,
  existingRecordFieldLabel,
  existingRecordFields,
  existingRecordType,
  changeFormState,
  formValues,
}) => {
  const fieldToChangeName = `profile.matchDetails[${repeatableIndex}].existingMatchExpression.fields[0].value`;

  const handleFieldSearch = (value, dataOptions) => {
    return dataOptions.filter(o => new RegExp(`${value}`, 'i').test(o.label));
  };

  const handleExistingRecordSelect = (newValue, fieldProps) => {
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

    fieldProps.input.onChange(newValue);
    changeFormState(fieldToChange, fieldToChangeValue);
  };

  const formatExistingRecordValue = useCallback(
    value => {
      if (!value) return '';

      const valueFromState = formValues.profile.matchDetails[repeatableIndex].existingMatchExpression.fields;

      const fieldValue = valueFromState[0].value;
      const fieldFromConfig = fieldsConfig.find(item => item.value === fieldValue && item.recordType === existingRecordType);

      if (fieldFromConfig?.fromResources) {
        return last(valueFromState).value;
      }

      const existingRecordField = existingRecordFields.find(item => item.id === fieldFromConfig?.id)?.value;

      return existingRecordField || '';
    },
    [existingRecordFields, existingRecordType, formValues.profile.matchDetails, repeatableIndex],
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
            name={fieldToChangeName}
            format={formatExistingRecordValue}
            render={criterionFieldProps => (
              <Selection
                {...criterionFieldProps}
                aria-label={existingRecordFieldLabel}
                dataOptions={existingRecordFields}
                onFilter={handleFieldSearch}
                onChange={value => handleExistingRecordSelect(value, criterionFieldProps)}
              />
            )}
          />
        </Col>
      </Row>
    </Section>
  );
};

ExistingSectionFolio.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  existingRecordType: PropTypes.oneOf([...Object.keys(FOLIO_RECORD_TYPES), '']).isRequired,
  changeFormState: PropTypes.func.isRequired,
  existingRecordFields: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  existingRecordFieldLabel: PropTypes.string,
  formValues: PropTypes.object,
};

ExistingSectionFolio.defaultProps = {
  existingRecordFields: null,
  existingRecordFieldLabel: '',
};
