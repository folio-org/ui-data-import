import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

import { QualifierSection } from './QualifierSection';

const qualifierSection = {
  recordFieldType: 'incoming',
  qualifierData: {
    comparisonPart: 'NUMERICS_ONLY',
    qualifierType: 'BEGINS_WITH',
    qualifierValue: 'test value',
  },
};
const qualifierSectionWithoutQualifierType = {
  recordFieldType: 'incoming',
  qualifierData: {
    comparisonPart: 'NUMERICS_ONLY',
    qualifierType: null,
    qualifierValue: null,
  },
};

const renderQualifierSection = ({
  recordFieldType,
  qualifierData,
}) => {
  const component = (
    <QualifierSection
      recordFieldType={recordFieldType}
      qualifierData={qualifierData}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('QualifierSection view component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderQualifierSection(qualifierSection);

    await runAxeTest({ rootNode: container });
  });

  describe('when there is a value', () => {
    it('should be rendered with additional content', () => {
      const { container } = renderQualifierSection(qualifierSection);
      const additionalContent = container.querySelector('.content');

      expect(additionalContent).toBeDefined();
    });
  });

  describe('when there is no value', () => {
    it('should be rendered without additional content', () => {
      const { container } = renderQualifierSection(qualifierSectionWithoutQualifierType);
      const additionalContent = container.querySelector('.content');

      expect(additionalContent).toBeNull();
    });
  });
});
