import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { noop } from 'lodash';

import {
  Row,
  Col,
  Select,
} from '@folio/stripes/components';

import { Section } from '../../..';

import {
  createOptionsList,
  COMPARISON_PARTS_OPTIONS,
} from '../../../../utils';

import css from '../MatchCriterions.css';

export const QualifierPartSection = ({
  repeatableIndex,
  recordFieldType,
  isOpen = false,
  onChange = noop,
}) => {
  const { formatMessage } = useIntl();

  const dataOptions = createOptionsList(COMPARISON_PARTS_OPTIONS, formatMessage);
  const expressionType = `${recordFieldType}MatchExpression`;

  return (
    <>
      <Section
        data-test-qualifier-part
        label={<FormattedMessage id={`ui-data-import.match.${recordFieldType}.part`} />}
        optional
        isOpen={isOpen}
        onChange={isChecked => {
          onChange(isChecked, repeatableIndex, expressionType, ['comparisonPart']);
        }}
        className={css.inputContainer}
      >
        <Row>
          <Col xs={4}>
            <FormattedMessage id="ui-data-import.match.comparison-part.placeholder">
              {([placeholder]) => (
                <Field
                  component={Select}
                  name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.comparisonPart`}
                  placeholder={placeholder}
                  dataOptions={dataOptions}
                  aria-label={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
      </Section>
      <Field
        name={`profile.matchDetails[${repeatableIndex}].${expressionType}.qualifier.comparisonPart`}
        render={() => null}
      />
    </>
  );
};

QualifierPartSection.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  recordFieldType: PropTypes.oneOf(['incoming', 'existing']).isRequired,
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
};
