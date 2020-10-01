import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import classnames from 'classnames';

import {
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';

import { Section } from '../../..';

import {
  createOptionsList,
  QUALIFIER_TYPES_OPTIONS,
  qualifierShape,
} from '../../../../utils';

import css from '../ViewMatchCriterion.css';

export const QualifierSection = ({
  qualifierData,
  recordFieldType,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = createOptionsList(QUALIFIER_TYPES_OPTIONS, formatMessage);
  const qualifierTypeLabel = dataOptions.find(item => item.value === qualifierData?.qualifierType)?.label;

  return (
    <Section
      data-test-qualifier
      label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.qualifier`} />}
      isOpen={!!qualifierData?.qualifierType || !!qualifierData?.qualifierValue}
      className={classnames([css.qualifier, css.inputContainer])}
    >
      <Row>
        <Col
          xs={4}
          className={css.fieldValue}
        >
          {qualifierTypeLabel || <NoValue />}
        </Col>
        <Col
          xs={8}
          className={css.fieldValue}
        >
          {qualifierData?.qualifierValue || <NoValue />}
        </Col>
      </Row>
    </Section>
  );
};

QualifierSection.propTypes = {
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  qualifierData: qualifierShape,
};

QualifierSection.defaultProps = { qualifierData: null };
