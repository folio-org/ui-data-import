import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';

import {
  Section,
  FOLIO_RECORD_TYPES,
} from '../../..';

import { getFieldMatched } from '../../../../utils';

import css from '../ViewMatchCriterion.css';

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
        <Col
          xs={12}
          className={css.fieldValue}
        >
          {getFieldMatched(existingRecordField, existingRecordType) || <NoValue />}
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

ExistingSectionFolio.defaultProps = {
  existingRecordField: null,
  existingRecordType: null,
  existingRecordFieldLabel: null,
};
