import React from 'react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

import { QualifierPartSection } from './QualifierPartSection';

const qualifierPartSection = {
  recordFieldType: 'incoming',
  qualifierData: {
    comparisonPart: 'NUMERICS_ONLY',
    qualifierType: 'BEGINS_WITH',
    qualifierValue: 'test value',
  },
};
const qualifierPartSectionWithoutValue = {
  recordFieldType: 'incoming',
  qualifierData: {
    comparisonPart: '',
    qualifierType: 'BEGINS_WITH',
    qualifierValue: 'test value',
  },
};

const renderQualifierPartSection = ({
  recordFieldType,
  qualifierData,
}) => {
  const component = (
    <QualifierPartSection
      recordFieldType={recordFieldType}
      qualifierData={qualifierData}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('QualifierPartSection view', () => {
  describe('when there is a value', () => {
    it('should be rendered with additional content', () => {
      const { container } = renderQualifierPartSection(qualifierPartSection);
      const additionalContent = container.querySelector('.content');

      expect(additionalContent).toBeDefined();
    });
  });

  describe('when there is no value', () => {
    it('should be rendered without additional content', () => {
      const { container } = renderQualifierPartSection(qualifierPartSectionWithoutValue);
      const additionalContent = container.querySelector('.content');

      expect(additionalContent).toBeNull();
    });
  });
});
