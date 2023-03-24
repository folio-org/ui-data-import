import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildResources } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { SummaryTable } from './SummaryTable';

jest.mock('@folio/stripes-data-transfer-components', () => ({
  ...jest.requireActual('@folio/stripes-data-transfer-components'),
  Preloader: () => <>Preloader</>,
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  TextLink: () => <>TextLink</>,
}));

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
    totalErrors: 2,
  }],
});

const history = createMemoryHistory();

const renderSummaryTable = (resourcesProp = resources) => {
  const component = (
    <Router history={history}>
      <SummaryTable
        jobExecutionId="test-id"
        resources={resourcesProp}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('SummaryTable component', () => {
  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderSummaryTable();

    await runAxeTest({ rootNode: container });
  });

  it('should render a table', () => {
    renderSummaryTable();

    expect(document.getElementById('job-summary-table')).toBeDefined();
  });

  describe('when no resources fetched', () => {
    it('should render Preloader', () => {
      const { getByText } = renderSummaryTable({ jobSummary: { records: [] } });

      expect(getByText('Preloader')).toBeDefined();
    });
  });

  describe('when there are errors', () => {
    it('should render total errors as a text link', () => {
      const { getByText } = renderSummaryTable();

      expect(getByText('TextLink')).toBeDefined();
    });
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
