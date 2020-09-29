import React from 'react';
import { useIntl } from 'react-intl';
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

import { getFieldMatchedWithCategory } from '../../../../utils';

import css from '../ViewMatchCriterion.css';

export const ExistingSectionFolio = ({
  existingRecordFields,
  existingRecordType,
  existingRecordFieldLabel,
  resources,
}) => {
  const intl = useIntl();

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
          {getFieldMatchedWithCategory(existingRecordFields, existingRecordType, resources, intl) || <NoValue />}
        </Col>
      </Row>
    </Section>
  );
};

ExistingSectionFolio.propTypes = {
  existingRecordFields: PropTypes.arrayOf(PropTypes.object),
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)),
  existingRecordFieldLabel: PropTypes.node,
  resources: PropTypes.object,
};

ExistingSectionFolio.defaultProps = {
  existingRecordFields: [],
  existingRecordType: null,
  existingRecordFieldLabel: null,
  resources: {},
};
