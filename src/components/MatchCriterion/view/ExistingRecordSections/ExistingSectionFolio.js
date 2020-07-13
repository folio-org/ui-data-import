import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  Row,
  Col,
  KeyValue, NoValue,
} from '@folio/stripes/components';

import {
  Section,
  FOLIO_RECORD_TYPES,
} from '../../..';

import { getFieldMatched } from '../../../../utils';

import css from '../../CommonMatchCriterion.css';

export const ExistingSectionFolio = ({
  existingRecordField,
  existingRecordType,
  existingRecordFieldLabel,
}) => {
  return (
    <Section
      label={existingRecordFieldLabel}
      className={classnames(css.field, css.inputContainer)}
    >
      <Row>
        <Col xs={12}>
          <KeyValue value={getFieldMatched(existingRecordField, existingRecordType) || <NoValue />} />
        </Col>
      </Row>
    </Section>
  );
};

ExistingSectionFolio.propTypes = {
  existingRecordField: PropTypes.string,
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)),
  existingRecordFieldLabel: PropTypes.node,
};
