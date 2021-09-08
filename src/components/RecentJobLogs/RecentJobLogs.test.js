import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { RecentJobLogs } from './RecentJobLogs';

jest.mock('../JobLogsContainer', () => ({
  JobLogsContainer: () => <span>JobLogsContainer</span>
}));

//const recentJobLogsProps = () => 'text';

const renderRecentJobLogs = () => {
  const childComponent = (
      <div>
        <span>child component</span>
      </div>
  );
  const component = (
    <RecentJobLogs>
      {childComponent}
    </RecentJobLogs>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('RecentJobLogs', () => {
  it('should be rendered', () => {
    const { debug } = renderRecentJobLogs();
    debug();
  });
});