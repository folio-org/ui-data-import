import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import {
  Row,
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { Section } from '../../..';

import css from '../ViewMatchCriterion.css';

export const MARCFieldSection = ({
  expressionDetails,
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
          <KeyValue
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-main`} />}
            value={expressionDetails.fields?.find(field => field.label === 'field')?.value || <NoValue />}
          />
        </Col>
        <Col
          data-test-field-in1
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in1`} />}
            value={expressionDetails.fields?.find(field => field.label === 'indicator1')?.value || <NoValue />}
          />
        </Col>
        <Col
          data-test-field-in2
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in2`} />}
            value={expressionDetails.fields?.find(field => field.label === 'indicator2')?.value || <NoValue />}
          />
        </Col>
        <Col
          data-test-field-subfield
          xs={5}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-subfield`} />}
            value={expressionDetails.fields?.find(field => field.label === 'recordSubfield')?.value || <NoValue />}
          />
        </Col>
      </Row>
    </Section>
  );
};

MARCFieldSection.propTypes = {
  expressionDetails: PropTypes.object.isRequired,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  recordFieldSectionLabel: PropTypes.node,
};

MARCFieldSection.defaultProps = { recordFieldSectionLabel: null };
