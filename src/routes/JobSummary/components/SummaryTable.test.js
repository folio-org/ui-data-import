import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { SummaryTable } from './SummaryTable';

const renderSummaryTable = () => {
  const component = <SummaryTable />;

  return renderWithIntl(component, translationsProperties);
};

describe('SummaryTable component', () => {
  it('should render a table', () => {
    renderSummaryTable();

    expect(document.getElementById('job-summary-table')).toBeDefined();
  });

  it('should have proper columns', () => {
    const { getByText } = renderSummaryTable();

    const errorColumn = document.getElementById('list-column-error');

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
