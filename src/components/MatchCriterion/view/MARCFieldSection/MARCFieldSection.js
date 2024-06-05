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

import { getTrimmedValue } from '../../../../utils';

import { Section } from '../../..';

import css from '../ViewMatchCriterion.css';

export const MARCFieldSection = ({
  expressionDetails,
  recordFieldSectionLabel = null,
  recordFieldType,
}) => {
  const getValue = fieldName => {
    const value = expressionDetails.fields?.find(field => field.label === fieldName)?.value;
    const formattedValue = getTrimmedValue(value);

    return formattedValue || <NoValue />;
  };

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
            value={getValue('field')}
          />
        </Col>
        <Col
          data-test-field-in1
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in1`} />}
            value={getValue('indicator1')}
          />
        </Col>
        <Col
          data-test-field-in2
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-in2`} />}
            value={getValue('indicator2')}
          />
        </Col>
        <Col
          data-test-field-subfield
          xs={5}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.MARC.field-subfield`} />}
            value={getValue('recordSubfield')}
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
