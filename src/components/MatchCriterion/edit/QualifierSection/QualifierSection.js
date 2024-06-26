import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
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
  isOpen = false,
  onChange = noop,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = createOptionsList(QUALIFIER_TYPES_OPTIONS, formatMessage);
  const expressionType = `${recordFieldType}MatchExpression`;

  return (
    <>
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
              {([placeholder]) => (
                <Field
                  component={Select}
                  name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.qualifierType`}
                  placeholder={placeholder}
                  dataOptions={dataOptions}
                  aria-label={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={8}>
            <FormattedMessage id="ui-data-import.match.qualifier.text">
              {([ariaLabel]) => (
                <Field
                  component={TextField}
                  name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.qualifierValue`}
                  aria-label={ariaLabel}
                />
              )}
            </FormattedMessage>

          </Col>
        </Row>
      </Section>
      <Field
        name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.qualifierType`}
        render={() => null}
      />
      <Field
        name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.qualifierValue`}
        render={() => null}
      />
    </>
  );
};

QualifierSection.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
};
