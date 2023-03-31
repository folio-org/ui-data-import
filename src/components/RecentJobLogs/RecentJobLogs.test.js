import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';
import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { RecentJobLogs } from './RecentJobLogs';

jest.mock('../JobLogsContainer', () => ({
  __esModule: true,
  default: ({ children }) => (
    <div>
      {children({ listProps: { resultsFormatter: { status: 'COMMITTED' } } })}
      <span>JobLogsContainer</span>
    </div>
  ),
}));
jest.mock('@folio/stripes-data-transfer-components', () => ({
  ...jest.requireActual('@folio/stripes-data-transfer-components'),
  JobLogs: () => <span>JobLogs</span>,
}));

const checkboxListProp = {
  isAllSelected: false,
  handleSelectAllCheckbox: noop,
  selectRecord: noop,
  selectedRecords: new Set(),
  selectAll: noop,
  deselectAll: noop,
};

const renderRecentJobLogs = () => {
  return renderWithIntl(<RecentJobLogs checkboxList={checkboxListProp} />, translationsProperties);
};

describe('RecentJobLogs component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderRecentJobLogs();

    await runAxeTest({ rootNode: container });
  });

  it('JobLogsContainer should be rendered', () => {
    const { getByText } = renderRecentJobLogs();

    expect(getByText('JobLogsContainer')).toBeDefined();
  });

  it('JobLogs should be rendered', () => {
    const { getByText } = renderRecentJobLogs();

    expect(getByText('JobLogs')).toBeDefined();
  });
});
