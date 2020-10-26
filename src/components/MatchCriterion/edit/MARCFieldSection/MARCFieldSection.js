import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import classnames from 'classnames';

import {
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import { Section } from '../../..';

import {
  validateAlphanumericOrAllowedValue,
  validateRequiredField,
  validateValueLength3,
  validateValueLength1,
  validateMARCFieldInMatchCriterion,
  RESTRICTED_MATCHING_MARC_FIELD_VALUE,
} from '../../../../utils';

import css from '../MatchCriterions.css';

export const MARCFieldSection = ({
  repeatableIndex,
  recordFieldSectionLabel,
  recordFieldType,
  field,
  indicator1,
  indicator2,
  subfield,
}) => {
  const [fieldValue, setFieldValue] = useState('');
  const [indicator1Value, setIndicator1Value] = useState('');
  const [indicator2Value, setIndicator2Value] = useState('');
  const [subfieldValue, setSubfieldValue] = useState('');

  useEffect(() => {
    setFieldValue(field);
  }, [field]);
  useEffect(() => {
    setIndicator1Value(indicator1);
  }, [indicator1]);
  useEffect(() => {
    setIndicator2Value(indicator2);
  }, [indicator2]);
  useEffect(() => {
    setSubfieldValue(subfield);
  }, [subfield]);

  const isRestrictedValue = RESTRICTED_MATCHING_MARC_FIELD_VALUE.some(value => value === fieldValue);

  const validateIndicator = useCallback(
    value => {
      if (isRestrictedValue) {
        return validateMARCFieldInMatchCriterion(indicator1Value, indicator2Value, subfieldValue);
      }

      return validateAlphanumericOrAllowedValue(value, '*') || validateValueLength1(value);
    },
    [isRestrictedValue, indicator1Value, indicator2Value, subfieldValue],
  );

  const validateSubfield = useCallback(
    value => {
      if (isRestrictedValue) {
        return validateMARCFieldInMatchCriterion(indicator1Value, indicator2Value, subfieldValue);
      }

      return validateRequiredField(value) || validateAlphanumericOrAllowedValue(value) || validateValueLength1(value);
    },
    [isRestrictedValue, indicator1Value, indicator2Value, subfieldValue],
  );

  return (
    <Section
      label={recordFieldSectionLabel}
      className={classnames(css.field, css.inputContainer)}
    >
      <Row>
        <Col
          data-test-field-main
          xs={3}
        >
          <Field
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[0].value`}
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-main`} />}
            validate={[validateRequiredField, validateAlphanumericOrAllowedValue, validateValueLength3]}
            onChange={e => setFieldValue(e.target.value)}
          />
        </Col>
        <Col
          data-test-field-in1
          xs={2}
        >
          <Field
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[1].value`}
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in1`} />}
            validate={[validateIndicator]}
            onChange={e => setIndicator1Value(e.target.value)}
          />
        </Col>
        <Col
          data-test-field-in2
          xs={2}
        >
          <Field
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[2].value`}
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in2`} />}
            validate={[validateIndicator]}
            onChange={e => setIndicator2Value(e.target.value)}
          />
        </Col>
        <Col
          data-test-field-subfield
          xs={5}
        >
          <Field
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[3].value`}
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-subfield`} />}
            validate={[validateSubfield]}
            onChange={e => setSubfieldValue(e.target.value)}
          />
        </Col>
      </Row>
    </Section>
  );
};

MARCFieldSection.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  recordFieldSectionLabel: PropTypes.string,
  field: PropTypes.string,
  indicator1: PropTypes.string,
  indicator2: PropTypes.string,
  subfield: PropTypes.string,
};

MARCFieldSection.defaultProps = {
  recordFieldSectionLabel: '',
  field: '',
  indicator1: '',
  indicator2: '',
  subfield: '',
};
