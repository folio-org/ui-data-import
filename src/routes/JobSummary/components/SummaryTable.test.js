import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildResources } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { SummaryTable } from './SummaryTable';

const entitySummary = {
  totalCreatedEntities: 100,
  totalUpdatedEntities: 0,
  totalDiscardedEntities: 0,
  totalErrors: 0,
};

const resources = buildResources({
  resourceName: 'jobSummary',
  records: [{
    sourceRecordSummary: { ...entitySummary },
    instanceSummary: { ...entitySummary },
    holdingSummary: { ...entitySummary },
    itemSummary: { ...entitySummary },
    authoritySummary: { ...entitySummary },
    orderSummary: { ...entitySummary },
    invoiceSummary: { ...entitySummary },
    totalErrors: 0,
  }],
});

const renderSummaryTable = () => {
  const component = (
    <SummaryTable
      jobExecutionId="test-id"
      resources={resources}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('SummaryTable component', () => {
  it('should render a table', () => {
    renderSummaryTable();

    expect(document.getElementById('job-summary-table')).toBeDefined();
  });

  it('should have proper columns', () => {
    const { getByText } = renderSummaryTable();

    const errorColumn = document.getElementById('job-summary-table-list-column-error');

    expect(getByText('Summary')).toBeDefined();
    expect(getByText('SRS MARC')).toBeDefined();
    expect(getByText('Instance')).toBeDefined();
    expect(getByText('Holdings')).toBeDefined();
    expect(getByText('Item')).toBeDefined();
    expect(getByText('Authority')).toBeDefined();
    expect(getByText('Order')).toBeDefined();
    expect(getByText('Invoice')).toBeDefined();
    expect(errorColumn.innerHTML).toEqual('Error');
  });

  it('should have proper rows', () => {
    const { getByText } = renderSummaryTable();

    const errorRow = document.querySelector('div[class^="mclRowContainer"] div[data-row-inner="3"]').firstChild;

    expect(getByText('Created')).toBeDefined();
    expect(getByText('Updated')).toBeDefined();
    expect(getByText('Discarded')).toBeDefined();
    expect(errorRow.innerHTML).toEqual('Error');
  });
});
