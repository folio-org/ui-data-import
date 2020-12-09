import React, { useContext } from 'react';

import {
  JobLogs,
  DEFAULT_JOB_LOGS_SORT_COLUMNS,
  sortStrings,
} from '@folio/stripes-data-transfer-components';
import { stripesConnect } from '@folio/stripes/core';

import { DataFetcherContext } from '../DataFetcher';
import { JobLogsContainer } from '../JobLogsContainer';

import {
  OCLC_CREATE_INSTANCE_ID,
  OCLC_UPDATE_INSTANCE_ID,
} from '../../utils';

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

  const filteredFromOCLCLogs = logs?.filter(log => {
    const { jobProfileInfo: { id: jobProfileId } } = log;

    return jobProfileId !== OCLC_CREATE_INSTANCE_ID && jobProfileId !== OCLC_UPDATE_INSTANCE_ID;
  });

  return (
    <JobLogsContainer>
      {({ listProps }) => (
        <JobLogs
          sortColumns={sortColumns}
          hasLoaded={hasLoaded}
          contentData={filteredFromOCLCLogs}
          formatter={listProps.resultsFormatter}
          {...listProps}
        />
      )}
    </JobLogsContainer>
  );
};

export const RecentJobLogs = stripesConnect(RecentJobLogsComponent);
