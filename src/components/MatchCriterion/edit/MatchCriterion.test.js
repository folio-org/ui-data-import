import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../../test/jest/helpers';

import { MatchCriterion } from './MatchCriterion';

const onEachChangeMock = jest.fn(text => text);
const matchCriterionWithQualifierType = {
  repeatableIndex: 0,
  matchDetails: {
    existingMatchExpression: {
      dataValueType: 'testDataValueType_1',
      fields: {
        label: 'testLabel_1',
        value: 'testValue_1',
      },
      qualifier: {
        comparisonPart: 'NUMERICS_ONLY',
        qualifierType: 'BEGINS_WITH',
        qualifierValue: 'testQualifierValue_1',
      },
    },
    incomingMatchExpression: {
      dataValueType: 'testDataValueType_2',
      fields: {
        label: 'testLabel_2',
        value: 'testValue_2',
      },
      qualifier: {
        comparisonPart: 'NUMERICS_ONLY',
        qualifierType: 'BEGINS_WITH',
        qualifierValue: 'testQualifierValue_2',
      },
    },
    matchCriterion: 'EXACTLY_MATCHES',
    existingRecordType: 'INSTANCE',
    incomingRecordType: 'HOLDINGS',
  },
  incomingRecordType: 'MARC_BIBLIOGRAPHIC',
  existingRecordType: 'MARC_HOLDINGS',
  staticValueType: 'TEXT',
  incomingRecordLabel: 'testIncomingRecordLabel',
  existingRecordLabel: 'testExistingRecordLabel',
  existingRecordFields: [{
    value: 'testValue_1',
    label: 'testLabel_1',
  }],
  onStaticValueTypeChange: onEachChangeMock,
  onQualifierSectionChange: onEachChangeMock,
  changeFormState: onEachChangeMock,
  formValues: { profile: { matchDetails: [{ existingMatchExpression: { fields: [{ value: 'test value' }] } }] } },
};
const matchCriterionWithoutQualifierType = {
  repeatableIndex: 0,
  matchDetails: {
    existingMatchExpression: {
      dataValueType: 'testDataValueType_1',
      fields: {
        label: 'testLabel_1',
        value: 'testValue_1',
      },
      qualifier: {
        comparisonPart: 'NUMERICS_ONLY',
        qualifierType: '',
        qualifierValue: 'testQualifierValue_1',
      },
    },
    incomingMatchExpression: {
      dataValueType: 'testDataValueType_2',
      fields: {
        label: 'testLabel_2',
        value: 'testValue_2',
      },
      qualifier: {
        comparisonPart: 'NUMERICS_ONLY',
        qualifierType: '',
        qualifierValue: 'testQualifierValue_2',
      },
    },
    matchCriterion: 'EXACTLY_MATCHES',
    existingRecordType: 'INSTANCE',
    incomingRecordType: 'HOLDINGS',
  },
  incomingRecordType: 'MARC_BIBLIOGRAPHIC',
  existingRecordType: 'MARC_HOLDINGS',
  staticValueType: 'TEXT',
  incomingRecordLabel: 'testIncomingRecordLabel',
  existingRecordLabel: 'testExistingRecordLabel',
  existingRecordFields: [{
    value: 'testValue_1',
    label: 'testLabel_1',
  }],
  onStaticValueTypeChange: onEachChangeMock,
  onQualifierSectionChange: onEachChangeMock,
  changeFormState: onEachChangeMock,
  formValues: { profile: { matchDetails: [{ existingMatchExpression: { fields: [{ value: 'test value' }] } }] } },
};

const renderMatchCriterion = ({
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
  const component = () => (
    <MatchCriterion
      repeatableIndex={repeatableIndex}
      matchDetails={matchDetails}
      incomingRecordType={incomingRecordType}
      existingRecordType={existingRecordType}
      staticValueType={staticValueType}
      incomingRecordLabel={incomingRecordLabel}
      existingRecordLabel={existingRecordLabel}
      existingRecordFields={existingRecordFields}
      onStaticValueTypeChange={onStaticValueTypeChange}
      onQualifierSectionChange={onQualifierSectionChange}
      changeFormState={changeFormState}
      formValues={formValues}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('MatchCriterion edit', () => {
  it('should be rendered with a qualifier type', () => {
    const { getByText } = renderMatchCriterion(matchCriterionWithQualifierType);

    expect(getByText('Incoming testIncomingRecordLabel record')).toBeDefined();
  });

  it('should be rendered without a qualifier type', () => {
    const { getByText } = renderMatchCriterion(matchCriterionWithoutQualifierType);

    expect(getByText('Incoming testIncomingRecordLabel record')).toBeDefined();
  });
});
