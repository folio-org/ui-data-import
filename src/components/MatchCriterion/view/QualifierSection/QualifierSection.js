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
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { Section } from '../../..';

import {
  QUALIFIER_TYPES_OPTIONS,
  qualifierShape,
} from '../../../../utils';

import css from '../ViewMatchCriterion.css';

export const QualifierSection = ({
  qualifierData,
  recordFieldType,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = QUALIFIER_TYPES_OPTIONS.map(option => (
    {
      value: option.value,
      label: formatMessage({ id: option.label }),
    }
  ));

  const qualifierTypeLabel = dataOptions.find(item => item.value === qualifierData?.qualifierType)?.label;

  return (
    <Section
      data-test-qualifier
      label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.qualifier`} />}
      isOpen={!!qualifierData?.qualifierType || !!qualifierData?.qualifierValue}
      className={classnames([css.qualifier, css.inputContainer])}
    >
      <Row>
        <Col xs={4}>
          <KeyValue value={qualifierTypeLabel || <NoValue />} />
        </Col>
        <Col xs={8}>
          <KeyValue value={qualifierData?.qualifierValue || <NoValue />} />
        </Col>
      </Row>
    </Section>
  );
};

QualifierSection.propTypes = {
  qualifierData: qualifierShape,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']),
};
