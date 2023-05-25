import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
  renderWithFinalForm,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { MatchCriterion } from './MatchCriterion';

jest.mock('.', () => ({
  MARCFieldSection: () => <span>MARCFieldSection</span>,
  IncomingSectionStatic: () => <span>IncomingSectionStatic</span>,
  QualifierSection: () => <span>QualifierSection</span>,
  QualifierPartSection: () => <span>QualifierPartSection</span>,
  ExistingSectionFolio: () => <span>ExistingSectionFolio</span>,
}));

const onEachChangeMock = jest.fn();
const matchCriterionProps = (
  existingRecordType,
  incomingRecordType,
  qualifierType,
) => {
  return {
    repeatableIndex: 0,
    matchDetails: {
      existingMatchExpression: {
        dataValueType: 'testDataValueType_1',
        fields: [{
          label: 'testLabel_1',
          value: 'testValue_1',
        }],
        qualifier: {
          comparisonPart: 'NUMERICS_ONLY',
          qualifierValue: 'testQualifierValue_1',
          qualifierType,
        },
      },
      incomingMatchExpression: {
        dataValueType: 'testDataValueType_2',
        fields: [{
          label: 'testLabel_2',
          value: 'testValue_2',
        }],
        qualifier: {
          comparisonPart: 'NUMERICS_ONLY',
          qualifierValue: 'testQualifierValue_2',
          qualifierType,
        },
      },
      matchCriterion: 'EXACTLY_MATCHES',
      existingRecordType,
      incomingRecordType,
    },
    incomingRecordType,
    existingRecordType,
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
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMatchCriterion({ ...matchCriterionProps('INSTANCE', 'MARC_BIBLIOGRAPHIC', 'BEGINS_WITH') });

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered with a qualifier type', () => {
    const { getByText } = renderMatchCriterion({ ...matchCriterionProps('INSTANCE', 'MARC_BIBLIOGRAPHIC', 'BEGINS_WITH') });

    expect(getByText('Incoming testIncomingRecordLabel record')).toBeDefined();
  });

  it('should be rendered without a qualifier type', () => {
    const { getByText } = renderMatchCriterion({ ...matchCriterionProps('INSTANCE', 'MARC_BIBLIOGRAPHIC', '') });

    expect(getByText('Incoming testIncomingRecordLabel record')).toBeDefined();
  });

  describe('when incoming record type value equals to', () => {
    describe('MARC_BIBLIOGRAPHIC', () => {
      it('should render incomingMarcSection', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('INSTANCE', 'MARC_BIBLIOGRAPHIC', 'BEGINS_WITH') });

        expect(getByText('MARCFieldSection')).toBeDefined();
      });
    });

    describe('MARC_AUTHORITY', () => {
      it('should render incomingMarcSection', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('INSTANCE', 'MARC_AUTHORITY', 'BEGINS_WITH') });

        expect(getByText('MARCFieldSection')).toBeDefined();
      });
    });

    describe('STATIC_VALUE', () => {
      it('should render incomingStaticValueSection', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('INSTANCE', 'STATIC_VALUE', 'BEGINS_WITH') });

        expect(getByText('IncomingSectionStatic')).toBeDefined();
      });
    });
  });

  describe('when existing record type value equals to', () => {
    describe('INSTANCE', () => {
      it('should render existingSectionFolio', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('INSTANCE', 'STATIC_VALUE', 'BEGINS_WITH') });

        expect(getByText('ExistingSectionFolio')).toBeDefined();
      });
    });

    describe('HOLDINGS', () => {
      it('should render existingSectionFolio', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('HOLDINGS', 'STATIC_VALUE', 'BEGINS_WITH') });

        expect(getByText('ExistingSectionFolio')).toBeDefined();
      });
    });

    describe('ITEM', () => {
      it('should render existingSectionFolio', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('ITEM', 'STATIC_VALUE', 'BEGINS_WITH') });

        expect(getByText('ExistingSectionFolio')).toBeDefined();
      });
    });

    describe('MARC_BIBLIOGRAPHIC', () => {
      it('should render existingMARCSection', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('MARC_BIBLIOGRAPHIC', 'STATIC_VALUE', 'BEGINS_WITH') });

        expect(getByText('MARCFieldSection')).toBeDefined();
      });
    });

    describe('MARC_AUTHORITY', () => {
      it('should render existingMARCSection', () => {
        const { getByText } = renderMatchCriterion({ ...matchCriterionProps('MARC_AUTHORITY', 'STATIC_VALUE', 'BEGINS_WITH') });

        expect(getByText('MARCFieldSection')).toBeDefined();
      });
    });
  });
});
