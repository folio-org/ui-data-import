import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { ViewMatchCriterion } from './ViewMatchCriterion';

jest.mock('.', () => ({
  ...jest.requireActual('.'),
  MARCFieldSection: () => <span>MARCFieldSection</span>,
  IncomingSectionStatic: () => <span>IncomingSectionStatic</span>,
  QualifierSection: () => <span>QualifierSection</span>,
  QualifierPartSection: () => <span>QualifierPartSection</span>,
  ExistingSectionFolio: () => <span>ExistingSectionFolio</span>,
}));

const viewMatchCriterionProps = {
  matchDetails: {
    existingMatchExpression: {
      dataValueType: 'testDataValueType_1',
      fields: [{
        label: 'testLabel_1',
        value: 'testValue_1',
      }],
      qualifier: {
        comparisonPart: 'NUMERICS_ONLY',
        qualifierType: 'BEGINS_WITH',
        qualifierValue: 'testQualifierValue_1',
      },
    },
    existingRecordType: 'HOLDINGS',
    incomingMatchExpression: {
      dataValueType: 'testDataValueType_2',
      fields: [{
        label: 'testLabel_2',
        value: 'testValue_2',
      }],
      qualifier: {
        comparisonPart: 'NUMERICS_ONLY',
        qualifierType: 'BEGINS_WITH',
        qualifierValue: 'testQualifierValue_2',
      },
    },
    incomingRecordType: 'INSTANCE',
    matchCriterion: 'EXACTLY_MATCHES',
  },
  incomingRecordType: 'MARC_BIBLIOGRAPHIC',
  existingRecordType: 'INSTANCE',
  incomingRecordLabel: 'testIncomingRecordLabel',
  existingRecordLabel: 'testExistingRecordLabel',
  resources: {},
};

const renderViewMatchCriterion = ({
  matchDetails,
  incomingRecordType,
  existingRecordType,
  incomingRecordLabel,
  existingRecordLabel,
  resources,
}) => {
  const component = (
    <ViewMatchCriterion
      matchDetails={matchDetails}
      incomingRecordType={incomingRecordType}
      existingRecordType={existingRecordType}
      incomingRecordLabel={incomingRecordLabel}
      existingRecordLabel={existingRecordLabel}
      resources={resources}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ViewMatchCriterion component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderViewMatchCriterion(viewMatchCriterionProps);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered with a qualifier type', () => {
    const { getByText } = renderViewMatchCriterion(viewMatchCriterionProps);

    expect(getByText('Incoming testIncomingRecordLabel record')).toBeDefined();
    expect(getByText('Existing testExistingRecordLabel record')).toBeDefined();
  });

  it('should be rendered without a qualifier type', () => {
    const { getByText } = renderViewMatchCriterion(viewMatchCriterionProps);

    expect(getByText('Existing testExistingRecordLabel record')).toBeDefined();
    expect(getByText('Incoming testIncomingRecordLabel record')).toBeDefined();
  });
});
