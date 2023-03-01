import React from 'react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import { QualifierPartSection } from './QualifierPartSection';

expect.extend(toHaveNoViolations);

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
  it('should be rendered with no axe errors', async () => {
    const { container } = renderQualifierPartSection(qualifierPartSection);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

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
