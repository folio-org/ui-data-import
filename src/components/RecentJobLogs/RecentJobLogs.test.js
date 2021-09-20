import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { RecentJobLogs } from './RecentJobLogs';

jest.mock('../JobLogsContainer', () => ({
  JobLogsContainer: ({ children }) => (
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

const renderRecentJobLogs = () => {
  return renderWithIntl(<RecentJobLogs />, translationsProperties);
};

describe('RecentJobLogs', () => {
  it('JobLogsContainer should be rendered', () => {
    const { getByText } = renderRecentJobLogs();

    expect(getByText('JobLogsContainer')).toBeDefined();
  });

  it('JobLogs should be rendered', () => {
    const { getByText } = renderRecentJobLogs();

    expect(getByText('JobLogs')).toBeDefined();
  });
});