import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import { MARCFieldSection } from './MARCFieldSection';

const marcFieldSection = {
  expressionDetails: {
    fields: [{
      label: 'field',
      value: 'test value1',
    }, {
      label: 'indicator1',
      value: 'test value2',
    }, {
      label: 'indicator2',
      value: 'test value3',
    }, {
      label: 'recordSubfield',
      value: 'test value4',
    }],
  },
  recordFieldType: 'incoming',
  recordFieldSectionLabel: <span>Test label</span>,
};
const marcFieldSectionWithoutValue = {
  expressionDetails: {
    fields: [{
      label: 'field',
      value: '',
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

describe('MARCFieldSection view component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMARCFieldSection(marcFieldSection);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered with label', () => {
    const { getByText } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('Test label')).toBeDefined();
  });

  it('should be rendered with value for Field label', () => {
    const { getByText } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('test value1')).toBeDefined();
  });

  it('should be rendered with value for In. 1 label', () => {
    const { getByText } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('test value2')).toBeDefined();
  });

  it('should be rendered with value for In. 2 label', () => {
    const { getByText } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('test value3')).toBeDefined();
  });

  it('should be rendered with value for Subfield label', () => {
    const { getByText } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('test value4')).toBeDefined();
  });

  it('should be rendered with no value (simple dash -)', () => {
    const { getAllByText } = renderMARCFieldSection(marcFieldSectionWithoutValue);

    expect(getAllByText('-')).toBeDefined();
  });
});
