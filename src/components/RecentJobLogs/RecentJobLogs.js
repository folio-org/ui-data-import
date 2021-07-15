import React, { useContext } from 'react';

import {
  JobLogs,
  DEFAULT_JOB_LOGS_SORT_COLUMNS,
  sortStrings,
} from '@folio/stripes-data-transfer-components';
import { stripesConnect } from '@folio/stripes/core';

import { DataFetcherContext } from '../DataFetcher';
import { JobLogsContainer } from '../JobLogsContainer';

const sortColumns = {
  ...DEFAULT_JOB_LOGS_SORT_COLUMNS,
  fileName: {
    sortFn: sortStrings,
    useFormatterFn: false,
  },
  status: {
    sortFn: sortStrings,
    useFormatterFn: true,
  },
};

const RecentJobLogsComponent = () => {
  const {
    logs,
    hasLoaded,
  } = useContext(DataFetcherContext);

  return (
    <JobLogsContainer>
      {({ listProps }) => (
        <JobLogs
          sortColumns={sortColumns}
          hasLoaded={hasLoaded}
          contentData={logs}
          formatter={listProps.resultsFormatter}
          {...listProps}
        />
      )}
    </JobLogsContainer>
  );
};

export const RecentJobLogs = stripesConnect(RecentJobLogsComponent);
