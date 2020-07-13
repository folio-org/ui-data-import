import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';
import classnames from 'classnames';

import {
  Row,
  Col,
  Select,
} from '@folio/stripes/components';

import { Section } from '../../../Section';
import {
  StaticValueText,
  StaticValueNumber,
  StaticValueDate,
  StaticValueDateRange,
} from './index';

import { STATIC_VALUE_TYPES } from '../../../../utils';

import css from '../MatchCriterions.css';

export const IncomingSectionStatic = ({
  repeatableIndex,
  staticValueType,
  onTypeChange,
}) => {
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
    [STATIC_VALUE_TYPES.TEXT]: <StaticValueText repeatableIndex={repeatableIndex} />,
    [STATIC_VALUE_TYPES.NUMBER]: <StaticValueNumber repeatableIndex={repeatableIndex} />,
    [STATIC_VALUE_TYPES.EXACT_DATE]: <StaticValueDate repeatableIndex={repeatableIndex} />,
    [STATIC_VALUE_TYPES.DATE_RANGE]: <StaticValueDateRange repeatableIndex={repeatableIndex} />,
  };

  return (
    <Section className={classnames(css.inputContainer, css.staticSection)}>
      <Row>
        <Col
          data-test-select-static-value
          xs={3}
        >
          <Field
            name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.staticValueType`}
            component={Select}
            dataOptions={dataOptions}
            onChange={onTypeChange}
          />
        </Col>
        <Col xs={9}>
          {staticValueSections[staticValueType]}
        </Col>
      </Row>
    </Section>
  );
};

IncomingSectionStatic.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  staticValueType: PropTypes.oneOf(Object.keys(STATIC_VALUE_TYPES)),
  onTypeChange: PropTypes.func,
};
