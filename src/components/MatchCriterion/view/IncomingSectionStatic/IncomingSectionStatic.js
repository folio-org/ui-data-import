import React from 'react';
import { useIntl } from 'react-intl';
import classnames from 'classnames';

import {
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';

import { Section } from '../../..';
import {
  StaticValueText,
  StaticValueNumber,
  StaticValueDate,
  StaticValueDateRange,
} from '.';

import {
  STATIC_VALUE_TYPES,
  staticValueDetailsShape,
} from '../../../../utils';

import css from '../ViewMatchCriterion.css';

export const IncomingSectionStatic = ({ staticValueDetails }) => {
  const { formatMessage } = useIntl();

  const dataOptions = [
    {
      value: STATIC_VALUE_TYPES.TEXT,
      label: formatMessage({ id: 'ui-data-import.match.incoming.static.value-type.text' }),
    }, {
      value: STATIC_VALUE_TYPES.NUMBER,
      label: formatMessage({ id: 'ui-data-import.match.incoming.static.value-type.number' }),
    }, {
      value: STATIC_VALUE_TYPES.EXACT_DATE,
      label: formatMessage({ id: 'ui-data-import.match.incoming.static.value-type.date' }),
    }, {
      value: STATIC_VALUE_TYPES.DATE_RANGE,
      label: formatMessage({ id: 'ui-data-import.match.incoming.static.value-type.date-range' }),
    },
  ];

  const staticValueSections = {
    [STATIC_VALUE_TYPES.TEXT]: <StaticValueText value={staticValueDetails?.text} />,
    [STATIC_VALUE_TYPES.NUMBER]: <StaticValueNumber value={staticValueDetails?.number} />,
    [STATIC_VALUE_TYPES.EXACT_DATE]: <StaticValueDate value={staticValueDetails?.exactDate} />,
    [STATIC_VALUE_TYPES.DATE_RANGE]: (
      <StaticValueDateRange
        fromDate={staticValueDetails?.fromDate}
        toDate={staticValueDetails?.toDate}
      />
    ),
  };

  const staticTypeLabel = dataOptions.find(item => item.value === staticValueDetails?.staticValueType)?.label;

  return (
    <Section className={classnames(css.inputContainer, css.staticSection)}>
      <Row>
        <Col
          data-test-select-static-value
          xs={3}
          className={css.fieldValue}
        >
          {staticTypeLabel || <NoValue />}
        </Col>
        <Col
          xs={9}
          className={css.fieldValue}
        >
          {staticValueSections[staticValueDetails?.staticValueType]}
        </Col>
      </Row>
    </Section>
  );
};

IncomingSectionStatic.propTypes = { staticValueDetails: staticValueDetailsShape };

IncomingSectionStatic.defaultProps = { staticValueDetails: null };
