import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';

import {
  Row,
  Col,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Section } from '../../..';

import { QUALIFIER_TYPES_OPTIONS } from '../../../../utils';

import css from '../MatchCriterions.css';

export const QualifierSection = ({
  repeatableIndex,
  recordFieldType,
  isOpen,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = QUALIFIER_TYPES_OPTIONS.map(option => (
    {
      value: option.value,
      label: formatMessage({ id: option.label }),
    }
  ));

  return (
    <Section
      data-test-qualifier
      label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.qualifier`} />}
      isOpen={isOpen}
      optional
      className={css.inputContainer}
    >
      <Row>
        <Col xs={4}>
          <FormattedMessage id="ui-data-import.match.qualifier.placeholder">
            {placeholder => (
              <Field
                component={Select}
                name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.qualifier.qualifierType`}
                placeholder={placeholder}
                dataOptions={dataOptions}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={8}>
          <Field
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${recordFieldType}MatchExpression.qualifier.qualifierValue`}
          />
        </Col>
      </Row>
    </Section>
  );
};

QualifierSection.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  isOpen: PropTypes.bool,
};

QualifierSection.defaultProps = { isOpen: false };
