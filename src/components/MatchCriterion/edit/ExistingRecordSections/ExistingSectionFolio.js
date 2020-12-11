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
}) => {
  const fieldToChangeName = `profile.matchDetails[${repeatableIndex}].existingMatchExpression.fields`;

  const handleFieldSearch = (value, dataOptions) => {
    return dataOptions.filter(o => new RegExp(`${value}`, 'i').test(o.label));
  };

  const handleExistingRecordSelect = value => {
    const fieldId = existingRecordFields.find(item => item.value === value)?.id;
    const fieldFromConfig = fieldsConfig.find(item => item.id === fieldId && item.recordType === existingRecordType);
    const fieldToChangeValue = [{
      label: MARC_FIELD_CONSTITUENT.FIELD,
      value: fieldFromConfig?.value,
    }];

    if (fieldFromConfig?.fromResources) {
      const { fromResources } = fieldFromConfig;

      fieldToChangeValue.push({
        label: fromResources.labelToSend,
        value,
      });
    }

    return fieldToChangeValue;
  };

  const formatExistingRecordValue = useCallback(
    value => {
      const fieldValue = value[0].value;
      const fieldFromConfig = fieldsConfig.find(item => item.value === fieldValue && item.recordType === existingRecordType);

      if (fieldFromConfig?.fromResources) {
        return last(value).value;
      }

      return existingRecordFields.find(item => item.id === fieldFromConfig?.id)?.value;
    },
    [existingRecordFields, existingRecordType],
  );

  const validateExistingFieldValue = useCallback(
    value => validateRequiredField(last(value).value),
    [],
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
            parse={handleExistingRecordSelect}
            onFilter={handleFieldSearch}
            onBlur={e => e.preventDefault()}
            validate={[validateExistingFieldValue]}
          />
        </Col>
      </Row>
    </Section>
  );
};

ExistingSectionFolio.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)).isRequired,
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
