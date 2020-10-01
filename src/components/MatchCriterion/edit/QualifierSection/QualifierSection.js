import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';
import { noop } from 'lodash';

import {
  Row,
  Col,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Section } from '../../..';

import {
  createOptionsList,
  QUALIFIER_TYPES_OPTIONS,
} from '../../../../utils';

import css from '../MatchCriterions.css';

export const QualifierSection = ({
  repeatableIndex,
  recordFieldType,
  isOpen,
  onChange,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = createOptionsList(QUALIFIER_TYPES_OPTIONS, formatMessage);
  const expressionType = `${recordFieldType}MatchExpression`;

  return (
    <Section
      data-test-qualifier
      label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.qualifier`} />}
      isOpen={isOpen}
      onChange={isChecked => {
        onChange(isChecked, repeatableIndex, expressionType, ['qualifierType', 'qualifierValue']);
      }}
      optional
      className={css.inputContainer}
    >
      <Row>
        <Col xs={4}>
          <FormattedMessage id="ui-data-import.match.qualifier.placeholder">
            {placeholder => (
              <Field
                component={Select}
                name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.qualifierType`}
                placeholder={placeholder}
                dataOptions={dataOptions}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={8}>
          <Field
            component={TextField}
            name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.qualifierValue`}
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
  onChange: PropTypes.func,
};

QualifierSection.defaultProps = {
  isOpen: false,
  onChange: noop,
};
