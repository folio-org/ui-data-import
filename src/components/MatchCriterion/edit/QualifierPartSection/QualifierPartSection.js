import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Row,
  Col,
  Select,
} from '@folio/stripes/components';

import { Section } from '../../..';

import { COMPARISON_PARTS_OPTIONS } from '../../../../utils';

import css from '../MatchCriterions.css';

export const QualifierPartSection = ({
  repeatableIndex,
  recordFieldType,
  isOpen,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = COMPARISON_PARTS_OPTIONS.map(option => (
    {
      value: option.value,
      label: formatMessage({ id: option.label }),
    }
  ));

  return (
    <Section
      data-test-qualifier-part
      label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.part`} />}
      optional
      isOpen={isOpen}
      className={css.inputContainer}
    >
      <Row>
        <Col xs={4}>
          <FormattedMessage id="ui-data-import.match.comparison-part.placeholder">
            {placeholder => (
              <Field
                component={Select}
                name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.qualifier.comparisonPart`}
                placeholder={placeholder}
                dataOptions={dataOptions}
              />
            )}
          </FormattedMessage>
        </Col>
      </Row>
    </Section>
  );
};

QualifierPartSection.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  isOpen: PropTypes.bool,
};

QualifierPartSection.defaultProps = { isOpen: false };
