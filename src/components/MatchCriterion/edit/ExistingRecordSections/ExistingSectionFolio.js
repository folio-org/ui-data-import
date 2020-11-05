import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  last,
  noop,
} from 'lodash';

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
  existingRecordFieldsValue,
  existingRecordType,
  dispatchFormChange,
}) => {
  const [isDirty, setDirty] = useState(false);

  const dropdownValue = last(existingRecordFieldsValue).value;

  const handleExistingRecordSelect = value => {
    const fieldToChangeName = `profile.matchDetails[${repeatableIndex}].existingMatchExpression.fields`;
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

    dispatchFormChange(fieldToChangeName, fieldToChangeValue);
    setDirty(value !== dropdownValue);
  };

  const handleFieldSearch = (value, dataOptions) => {
    return dataOptions.filter(o => new RegExp(`${value}`, 'i').test(o.label));
  };

  return (
    <Section
      label={existingRecordFieldLabel}
      className={classnames(css.field, css.inputContainer)}
    >
      <Row>
        <Col xs={12}>
          <Selection
            id="criterion-value-type"
            value={dropdownValue}
            dataOptions={existingRecordFields}
            onChange={handleExistingRecordSelect}
            onFilter={handleFieldSearch}
            dirty={isDirty}
          />
        </Col>
      </Row>
    </Section>
  );
};

ExistingSectionFolio.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  existingRecordFieldsValue: PropTypes.arrayOf(PropTypes.object).isRequired,
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)).isRequired,
  existingRecordFields: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  existingRecordFieldLabel: PropTypes.node,
  dispatchFormChange: PropTypes.func,
};

ExistingSectionFolio.defaultProps = {
  existingRecordFields: null,
  existingRecordFieldLabel: null,
  dispatchFormChange: noop,
};
