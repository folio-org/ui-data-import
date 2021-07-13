import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

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
  it('should be rendered with additional content', () => {
    const { container } = renderQualifierPartSection(qualifierPartSection);
    const element = container.querySelector('.content');

    expect(element).toBeDefined();
  });

  it('should be rendered without additional content', () => {
    const { container } = renderQualifierPartSection(qualifierPartSectionWithoutValue);
    const element = container.querySelector('.content');

    expect(element).toBeNull();
  });
});
