import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useIntl } from 'react-intl';

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
// import { getFieldMatchedWithCategory } from '../../../../utils';

export const ExistingSectionFolio = ({
  existingRecordFields,
  existingRecordType,
  existingRecordFieldLabel,
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
          {/* {
            getFieldMatchedWithCategory(existingRecordFields, existingRecordType, intl.formatMessage)
          } */}
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
};

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
