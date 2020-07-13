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
  COMPARISON_PARTS_OPTIONS,
  qualifierShape,
} from '../../../../utils';

import css from '../ViewMatchCriterion.css';

export const QualifierPartSection = ({
  qualifierData,
  recordFieldType,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = COMPARISON_PARTS_OPTIONS.map(option => (
    {
      value: option.value,
      label: formatMessage({ id: option.label }),
    }
  ));

  const qualifierPartLabel = dataOptions.find(item => item.value === qualifierData?.comparisonPart)?.label;

  return (
    <Section
      data-test-qualifier-part
      label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.part`} />}
      isOpen={!!qualifierData?.comparisonPart}
      className={classnames([css.part, css.inputContainer])}
    >
      <Row>
        <Col xs={4}>
          <KeyValue value={qualifierPartLabel || <NoValue />} />
        </Col>
      </Row>
    </Section>
  );
};

QualifierPartSection.propTypes = {
  qualifierData: qualifierShape,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']),
};
