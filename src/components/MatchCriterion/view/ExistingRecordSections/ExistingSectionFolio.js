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
import { MatchingFieldsManager } from '../../../MatchingFieldsManager';

import css from '../ViewMatchCriterion.css';

export const ExistingSectionFolio = ({
  existingRecordFields,
  existingRecordType,
  existingRecordFieldLabel,
}) => (
  <Section
    label={existingRecordFieldLabel}
    className={classnames(css.field, css.inputContainer)}
  >
    <Row>
      <Col
        xs={12}
        className={css.fieldValue}
      >
        <MatchingFieldsManager>
          {({ getFieldMatchedWithCategory }) => {
            return getFieldMatchedWithCategory(existingRecordFields, existingRecordType)
            || <NoValue />;
          }}
        </MatchingFieldsManager>
      </Col>
    </Row>
  </Section>
);

ExistingSectionFolio.propTypes = {
  existingRecordFields: PropTypes.arrayOf(PropTypes.object),
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)),
  existingRecordFieldLabel: PropTypes.node,
};

ExistingSectionFolio.defaultProps = {
  existingRecordFields: [],
  existingRecordType: null,
  existingRecordFieldLabel: null,
};
