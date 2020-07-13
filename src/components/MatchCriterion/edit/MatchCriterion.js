import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import classnames from 'classnames';

import {
  Accordion,
  Row,
  Col,
  Select,
} from '@folio/stripes/components';

import {
  Section,
  INCOMING_RECORD_TYPES,
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
  incomingRecordLabel,
  existingRecordLabel,
  existingRecordFields,
  onStaticValueTypeChange,
  staticValueType,
}) => {
  const { formatMessage } = useIntl();

  const {
    incomingMatchExpression,
    existingMatchExpression,
  } = matchDetails;

  const matchCriterionOptions = CRITERION_TYPES_OPTIONS.map(option => (
    {
      value: option.value,
      label: formatMessage({ id: option.label }),
    }
  ));

  const incomingRecordLbl = (
    <FormattedMessage
      id="ui-data-import.match.incoming.record"
      values={{ recordType: incomingRecordLabel }}
    />
  );
  const incomingRecordFieldLbl = (
    <FormattedMessage
      id="ui-data-import.match.incoming.record.field"
      values={{ recordType: incomingRecordLabel }}
    />
  );
  const existingRecordLbl = (
    <FormattedMessage
      id="ui-data-import.match.existing.record"
      values={{ recordType: existingRecordLabel }}
    />
  );
  const existingRecordFieldLbl = (
    <FormattedMessage
      id="ui-data-import.match.existing.record.field"
      values={{ recordType: existingRecordLabel }}
    />
  );

  const incomingMARCSectionElement = (
    <MARCFieldSection
      repeatableIndex={repeatableIndex}
      recordFieldSectionLabel={incomingRecordFieldLbl}
      recordFieldType="incoming"
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
    />
  );
  const incomingQualifierPartSectionElement = (
    <QualifierPartSection
      repeatableIndex={repeatableIndex}
      recordFieldType="incoming"
      isOpen={!!incomingMatchExpression.qualifier?.comparisonPart}
    />
  );
  const existingMARCSectionElement = (
    <MARCFieldSection
      repeatableIndex={repeatableIndex}
      recordFieldSectionLabel={existingRecordFieldLbl}
      recordFieldType="existing"
    />
  );
  const existingSectionFolioElement = (
    <ExistingSectionFolio
      repeatableIndex={repeatableIndex}
      existingRecordFieldLabel={existingRecordFieldLbl}
      existingRecordFields={existingRecordFields}
    />
  );
  const existingQualifierSectionElement = (
    <QualifierSection
      repeatableIndex={repeatableIndex}
      recordFieldType="existing"
      isOpen={!!existingMatchExpression.qualifier?.qualifierType || !!existingMatchExpression.qualifier?.qualifierValue}
    />
  );
  const existingQualifierPartSectionElement = (
    <QualifierPartSection
      repeatableIndex={repeatableIndex}
      recordFieldType="existing"
      isOpen={!!existingMatchExpression.qualifier?.comparisonPart}
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
    EDIFACT_INVOICE: incomingQualifierSectionElement,
    DELIMITED: incomingQualifierSectionElement,
  };
  const incomingRecordQualifierPartSections = {
    MARC_BIBLIOGRAPHIC: incomingQualifierPartSectionElement,
    MARC_HOLDINGS: incomingQualifierPartSectionElement,
    MARC_AUTHORITY: incomingQualifierPartSectionElement,
    EDIFACT_INVOICE: incomingQualifierPartSectionElement,
    DELIMITED: incomingQualifierPartSectionElement,
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
                <Field
                  component={Select}
                  name={`profile.matchDetails[${repeatableIndex}].matchCriterion`}
                  dataOptions={matchCriterionOptions}
                />
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
  incomingRecordType: PropTypes.oneOf(Object.keys(INCOMING_RECORD_TYPES)),
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)),
  incomingRecordLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  existingRecordLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onStaticValueTypeChange: PropTypes.func,
  staticValueType: PropTypes.oneOf(Object.keys(STATIC_VALUE_TYPES)),
};
