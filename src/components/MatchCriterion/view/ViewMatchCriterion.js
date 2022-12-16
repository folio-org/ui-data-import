import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import {
  Accordion,
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { Section } from '../..';
import {
  MARCFieldSection,
  IncomingSectionStatic,
  QualifierSection,
  QualifierPartSection,
  ExistingSectionFolio,
} from '.';

import {
  CRITERION_TYPES_OPTIONS,
  matchDetailsShape,
  MATCH_INCOMING_RECORD_TYPES,
} from '../../../utils';

import css from './ViewMatchCriterion.css';

export const ViewMatchCriterion = ({
  matchDetails,
  incomingRecordLabel,
  existingRecordLabel,
  resources,
}) => {
  const {
    incomingRecordType,
    existingRecordType,
    incomingMatchExpression,
    existingMatchExpression,
    matchCriterion,
  } = matchDetails;

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
      expressionDetails={incomingMatchExpression}
      recordFieldSectionLabel={incomingRecordFieldLbl}
      recordFieldType="incoming"
    />
  );
  const incomingStaticValueSectionElement = (
    <IncomingSectionStatic staticValueDetails={incomingMatchExpression.staticValueDetails} />
  );
  const incomingQualifierSectionElement = (
    <QualifierSection
      qualifierData={incomingMatchExpression.qualifier}
      recordFieldType="incoming"
    />
  );
  const incomingQualifierPartSectionElement = (
    <QualifierPartSection
      qualifierData={incomingMatchExpression.qualifier}
      recordFieldType="incoming"
    />
  );
  const existingMARCSectionElement = (
    <MARCFieldSection
      expressionDetails={existingMatchExpression}
      recordFieldSectionLabel={existingRecordFieldLbl}
      recordFieldType="existing"
    />
  );
  const existingSectionFolioElement = (
    <ExistingSectionFolio
      existingRecordFields={existingMatchExpression.fields}
      existingRecordType={existingRecordType}
      existingRecordFieldLabel={existingRecordFieldLbl}
      resources={resources}
    />
  );
  const existingQualifierSectionElement = (
    <QualifierSection
      qualifierData={existingMatchExpression.qualifier}
      recordFieldType="existing"
    />
  );
  const existingQualifierPartSectionElement = (
    <QualifierPartSection
      qualifierData={existingMatchExpression.qualifier}
      recordFieldType="existing"
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

  const matchCriterionLabelId = CRITERION_TYPES_OPTIONS.find(option => option.value === matchCriterion)?.label;

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
                className={css.fieldValue}
              >
                {matchCriterionLabelId ? <FormattedMessage id={matchCriterionLabelId} /> : <NoValue />}
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

ViewMatchCriterion.propTypes = {
  matchDetails: matchDetailsShape.isRequired,
  incomingRecordType: PropTypes.oneOf(Object.keys(MATCH_INCOMING_RECORD_TYPES)),
  existingRecordType: PropTypes.oneOf(Object.keys(FOLIO_RECORD_TYPES)),
  incomingRecordLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  existingRecordLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  resources: PropTypes.object,
};

ViewMatchCriterion.defaultProps = {
  incomingRecordType: null,
  existingRecordType: null,
  incomingRecordLabel: null,
  existingRecordLabel: null,
};
