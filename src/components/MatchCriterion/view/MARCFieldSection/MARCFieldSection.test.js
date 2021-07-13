import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import { MARCFieldSection } from './MARCFieldSection';

const marcFieldSection = {
  expressionDetails: {
    fields: [{
      label: 'field',
      value: 'test value',
    }],
  },
  recordFieldType: 'incoming',
  recordFieldSectionLabel: <span>Test label</span>,
};

const renderMARCFieldSection = ({
  expressionDetails,
  recordFieldType,
  recordFieldSectionLabel,
}) => {
  const component = (
    <MARCFieldSection
      expressionDetails={expressionDetails}
      recordFieldType={recordFieldType}
      recordFieldSectionLabel={recordFieldSectionLabel}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MARCFieldSection view', () => {
  it('should be rendered with label', () => {
    const { getByText } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('Test label')).toBeDefined();
  });
});
