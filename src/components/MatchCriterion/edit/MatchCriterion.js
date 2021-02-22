import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import classnames from 'classnames';
import { noop } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  Select,
} from '@folio/stripes/components';

import {
  Section,
  MATCH_INCOMING_RECORD_TYPES,
  FOLIO_RECORD_TYPES,
} from '../..';
import {
  MARCFieldSection,
  IncomingSectionStatic,
  QualifierSection,
  QualifierPartSection,
  ExistingSectionFolio,
} from '.';

import {
  createOptionsList,
  CRITERION_TYPES_OPTIONS,
  STATIC_VALUE_TYPES,
  matchDetailsShape,
} from '../../../utils';

import css from './MatchCriterions.css';

export const MatchCriterion = ({
  repeatableIndex,
  matchDetails,
  incomingRecordType,
  existingRecordType,
  staticValueType,
  incomingRecordLabel,
  existingRecordLabel,
  existingRecordFields,
  onStaticValueTypeChange,
  onQualifierSectionChange,
  changeFormState,
  formValues,
}) => {
  const { formatMessage } = useIntl();

  const {
    incomingMatchExpression,
    existingMatchExpression,
  } = matchDetails;

  const matchCriterionOptions = createOptionsList(CRITERION_TYPES_OPTIONS, formatMessage);

  const getMARCFieldValue = (typeExpression, fieldName) => typeExpression?.fields
    .find(field => field.label === fieldName)?.value;

  const incomingRecordLbl = formatMessage(
    { id: 'ui-data-import.match.incoming.record' },
    { recordType: incomingRecordLabel },
  );
  const incomingRecordFieldLbl = formatMessage(
    { id: 'ui-data-import.match.incoming.record.field' },
    { recordType: incomingRecordLabel },
  );
  const existingRecordLbl = formatMessage(
    { id: 'ui-data-import.match.existing.record' },
    { recordType: existingRecordLabel },
  );

  const existingRecordFieldLbl = formatMessage(
    { id: 'ui-data-import.match.existing.record.field' },
    { recordType: existingRecordLabel },
  );

  const incomingMARCSectionElement = (
    <MARCFieldSection
      repeatableIndex={repeatableIndex}
      recordFieldSectionLabel={incomingRecordFieldLbl}
      recordFieldType="incoming"
      field={getMARCFieldValue(incomingMatchExpression, 'field')}
      indicator1={getMARCFieldValue(incomingMatchExpression, 'indicator1')}
      indicator2={getMARCFieldValue(incomingMatchExpression, 'indicator2')}
      subfield={getMARCFieldValue(incomingMatchExpression, 'recordSubfield')}
    />
  );
  const incomingStaticValueSectionElement = (
    <IncomingSectionStatic
      repeatableIndex={repeatableIndex}
      staticValueType={staticValueType}
      onTypeChange={onStaticValueTypeChange}
    />
  );
  const incomingQualifierSectionElement = (
    <QualifierSection
      repeatableIndex={repeatableIndex}
      recordFieldType="incoming"
      isOpen={!!incomingMatchExpression.qualifier?.qualifierType || !!incomingMatchExpression.qualifier?.qualifierValue}
      onChange={onQualifierSectionChange}
    />
  );
  const incomingQualifierPartSectionElement = (
    <QualifierPartSection
      repeatableIndex={repeatableIndex}
      recordFieldType="incoming"
      isOpen={!!incomingMatchExpression.qualifier?.comparisonPart}
      onChange={onQualifierSectionChange}
    />
  );
  const existingMARCSectionElement = (
    <MARCFieldSection
      repeatableIndex={repeatableIndex}
      recordFieldSectionLabel={existingRecordFieldLbl}
      recordFieldType="existing"
      field={getMARCFieldValue(existingMatchExpression, 'field')}
      indicator1={getMARCFieldValue(existingMatchExpression, 'indicator1')}
      indicator2={getMARCFieldValue(existingMatchExpression, 'indicator2')}
      subfield={getMARCFieldValue(existingMatchExpression, 'recordSubfield')}
    />
  );
  const existingSectionFolioElement = (
    <ExistingSectionFolio
      repeatableIndex={repeatableIndex}
      existingRecordFieldLabel={existingRecordFieldLbl}
      existingRecordFields={existingRecordFields}
      existingRecordType={existingRecordType}
      changeFormState={changeFormState}
      formValues={formValues}
    />
  );
  const existingQualifierSectionElement = (
    <QualifierSection
      repeatableIndex={repeatableIndex}
      recordFieldType="existing"
      isOpen={!!existingMatchExpression.qualifier?.qualifierType || !!existingMatchExpression.qualifier?.qualifierValue}
      onChange={onQualifierSectionChange}
    />
  );
  const existingQualifierPartSectionElement = (
    <QualifierPartSection
      repeatableIndex={repeatableIndex}
      recordFieldType="existing"
      isOpen={!!existingMatchExpression.qualifier?.comparisonPart}
      onChange={onQualifierSectionChange}
    />
  );

  const incomingRecordFieldSections = {
    MARC_BIBLIOGRAPHIC: incomingMARCSectionElement,
    MARC_HOLDINGS: incomingMARCSectionElement,
    MARC_AUTHORITY: incomingMARCSectionElement,
    STATIC_VALUE: incomingStaticValueSectionElement,
  };
  const incomingRecordQualifierSections = {
    MARC_BIBLIOGRAPHIC: incomingQualifierSectionElement,
    MARC_HOLDINGS: incomingQualifierSectionElement,
    MARC_AUTHORITY: incomingQualifierSectionElement,
  };
  const incomingRecordQualifierPartSections = {
    MARC_BIBLIOGRAPHIC: incomingQualifierPartSectionElement,
    MARC_HOLDINGS: incomingQualifierPartSectionElement,
    MARC_AUTHORITY: incomingQualifierPartSectionElement,
  };
  const existingRecordFieldSections = {
    INSTANCE: existingSectionFolioElement,
    HOLDINGS: existingSectionFolioElement,
    ITEM: existingSectionFolioElement,
    ORDER: existingSectionFolioElement,
    INVOICE: existingSectionFolioElement,
    MARC_BIBLIOGRAPHIC: existingMARCSectionElement,
    MARC_HOLDINGS: existingMARCSectionElement,
    MARC_AUTHORITY: existingMARCSectionElement,
  };
  const existingRecordQualifierSections = {
    INSTANCE: existingQualifierSectionElement,
    HOLDINGS: existingQualifierSectionElement,
    ITEM: existingQualifierSectionElement,
    ORDER: existingQualifierSectionElement,
    INVOICE: existingQualifierSectionElement,
    MARC_BIBLIOGRAPHIC: existingQualifierSectionElement,
    MARC_HOLDINGS: existingQualifierSectionElement,
    MARC_AUTHORITY: existingQualifierSectionElement,
  };
  const existingRecordQualifierPartSections = {
    INSTANCE: existingQualifierPartSectionElement,
    HOLDINGS: existingQualifierPartSectionElement,
    ITEM: existingQualifierPartSectionElement,
    ORDER: existingQualifierPartSectionElement,
    INVOICE: existingQualifierPartSectionElement,
    MARC_BIBLIOGRAPHIC: existingQualifierPartSectionElement,
    MARC_HOLDINGS: existingQualifierPartSectionElement,
    MARC_AUTHORITY: existingQualifierPartSectionElement,
  };

  return (
    <Section className={css.matchCriteria}>
      <Accordion
        label={<FormattedMessage id="ui-data-import.match.criterion" />}
        separator={false}
      >
        <Section className={css.matchCriterion}>
          <Section
            label={incomingRecordLbl}
            className={css.incoming}
          >
            {incomingRecordFieldSections[incomingRecordType]}
            {incomingRecordQualifierSections[incomingRecordType]}
            {incomingRecordQualifierPartSections[incomingRecordType]}
          </Section>
          <Section
            label={<FormattedMessage id="ui-data-import.match.criterion" />}
            className={classnames(css.criterionSection, css.inputContainer)}
          >
            <Row>
              <Col
                data-test-match-criterion
                xs={12}
              >
                <FormattedMessage id="ui-data-import.match.criterion">
                  {([ariaLabel]) => (
                    <Field
                      component={Select}
                      name={`profile.matchDetails[${repeatableIndex}].matchCriterion`}
                      dataOptions={matchCriterionOptions}
                      aria-label={ariaLabel}
                    />
                  )}
                </FormattedMessage>
              </Col>
            </Row>
          </Section>
          <Section
            label={existingRecordLbl}
            className={css.existing}
          >
            {existingRecordFieldSections[existingRecordType]}
            {existingRecordQualifierSections[existingRecordType]}
            {existingRecordQualifierPartSections[existingRecordType]}
          </Section>
        </Section>
      </Accordion>
    </Section>
  );
};

MatchCriterion.propTypes = {
  repeatableIndex: PropTypes.number.isRequired,
  matchDetails: matchDetailsShape.isRequired,
  existingRecordFields: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  changeFormState: PropTypes.func.isRequired,
  incomingRecordType: PropTypes.oneOf([...Object.keys(MATCH_INCOMING_RECORD_TYPES), '']),
  existingRecordType: PropTypes.oneOf([...Object.keys(FOLIO_RECORD_TYPES), '']),
  staticValueType: PropTypes.oneOf([...Object.keys(STATIC_VALUE_TYPES), '']),
  incomingRecordLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  existingRecordLabel: PropTypes.string,
  onStaticValueTypeChange: PropTypes.func,
  onQualifierSectionChange: PropTypes.func,
  formValues: PropTypes.object,
};

MatchCriterion.defaultProps = {
  incomingRecordType: null,
  existingRecordType: null,
  staticValueType: null,
  incomingRecordLabel: null,
  existingRecordLabel: '',
  onStaticValueTypeChange: noop,
  onQualifierSectionChange: noop,
};
