import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import classnames from 'classnames';

import {
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import { Section } from '../../..';

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
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[0].value`}
            render={mainFieldProps => (
              <TextField
                {...mainFieldProps}
                label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-main`} />}
                onChange={event => {
                  const value = event.target.value;

                  mainFieldProps.input.onChange(value);
                }}
              />
            )}
          />
        </Col>
        <Col
          data-test-field-in1
          xs={2}
        >
          <Field
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[1].value`}
            render={indicator1FieldProps => (
              <TextField
                {...indicator1FieldProps}
                label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in1`} />}
                onChange={event => {
                  const value = event.target.value;

                  indicator1FieldProps.input.onChange(value);
                }}
              />
            )}
          />
        </Col>
        <Col
          data-test-field-in2
          xs={2}
        >
          <Field
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[2].value`}
            render={indicator2FieldProps => (
              <TextField
                {...indicator2FieldProps}
                label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in2`} />}
                onChange={event => {
                  const value = event.target.value;

                  indicator2FieldProps.input.onChange(value);
                }}
              />
            )}
          />
        </Col>
        <Col
          data-test-field-subfield
          xs={5}
        >
          <Field
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.fields[3].value`}
            render={subfieldFieldProps => (
              <TextField
                {...subfieldFieldProps}
                label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-subfield`} />}
                onChange={event => {
                  const value = event.target.value;

                  subfieldFieldProps.input.onChange(value);
                }}
              />
            )}
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
};

MARCFieldSection.defaultProps = { recordFieldSectionLabel: '' };
