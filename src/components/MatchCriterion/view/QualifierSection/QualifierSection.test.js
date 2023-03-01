import React from 'react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import { QualifierSection } from './QualifierSection';

expect.extend(toHaveNoViolations);

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
    qualifierType: '',
    qualifierValue: '',
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

describe('QualifierSection view', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderQualifierSection(qualifierSection);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
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
