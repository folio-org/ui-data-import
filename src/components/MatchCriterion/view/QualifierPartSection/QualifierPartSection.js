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
  COMPARISON_PARTS_OPTIONS,
  qualifierShape,
} from '../../../../utils';

import css from '../ViewMatchCriterion.css';

export const QualifierPartSection = ({
  qualifierData,
  recordFieldType,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = createOptionsList(COMPARISON_PARTS_OPTIONS, formatMessage);

  const qualifierPartLabel = dataOptions.find(item => item.value === qualifierData?.comparisonPart)?.label;

  return (
    <Section
      data-test-qualifier-part
      label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.part`} />}
      isOpen={!!qualifierData?.comparisonPart}
      className={classnames([css.part, css.inputContainer])}
    >
      <Row>
        <Col
          xs={4}
          className={css.fieldValue}
        >
          {qualifierPartLabel || <NoValue />}
        </Col>
      </Row>
    </Section>
  );
};

QualifierPartSection.propTypes = {
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  qualifierData: qualifierShape,
};

QualifierPartSection.defaultProps = { qualifierData: null };
