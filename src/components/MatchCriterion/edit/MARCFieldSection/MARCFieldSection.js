import React from 'react';
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
  validateValueLength3,
  validateValueLength1,
} from '../../../../utils';

import css from '../MatchCriterions.css';

export const MARCFieldSection = ({
  repeatableIndex,
  recordFieldSectionLabel,
  recordFieldType,
}) => {
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
            validate={[validateAlphanumericOrAllowedValue, validateValueLength3]}
          />
        </Col>
        <Col
          data-test-field-in1
          xs={2}
        >
          <Field
            id="criterion-incoming.field.in1"
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[1].value`}
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in1`} />}
            validate={[validateAlphanumericOrAllowedValue, validateValueLength1]}
          />
        </Col>
        <Col
          data-test-field-in2
          xs={2}
        >
          <Field
            id="criterion-incoming.field.in2"
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[2].value`}
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in2`} />}
            validate={[validateAlphanumericOrAllowedValue, validateValueLength1]}
          />
        </Col>
        <Col
          data-test-field-subfield
          xs={5}
        >
          <Field
            id="criterion-incoming.field.subfield"
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[3].value`}
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-subfield`} />}
            validate={[validateAlphanumericOrAllowedValue, validateValueLength1]}
          />
        </Col>
      </Row>
    </Section>
  );
};

MARCFieldSection.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  recordFieldSectionLabel: PropTypes.node,
};

MARCFieldSection.defaultProps = { recordFieldSectionLabel: null };
