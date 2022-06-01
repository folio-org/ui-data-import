import React from 'react';
import PropTypes from 'prop-types';

import {
  JobLogs,
  DEFAULT_JOB_LOGS_SORT_COLUMNS,
  sortStrings,
} from '@folio/stripes-data-transfer-components';
import { stripesShape } from '@folio/stripes-core';

import { JobLogsContainer } from '../JobLogsContainer';

import { checkboxListShape } from '../../utils';

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

export const RecentJobLogs = ({
  logs,
  haveLogsLoaded,
  checkboxList,
  stripes,
}) => {
  return (
    <JobLogsContainer
      checkboxList={checkboxList}
      stripes={stripes}
    >
      {({ listProps }) => (
        <JobLogs
          sortColumns={sortColumns}
          hasLoaded={haveLogsLoaded}
          contentData={logs}
          formatter={listProps.resultsFormatter}
          {...listProps}
        />
      )}
    </JobLogsContainer>
  );
};

RecentJobLogs.propTypes = {
  checkboxList: checkboxListShape.isRequired,
  logs: PropTypes.arrayOf(PropTypes.object),
  haveLogsLoaded: PropTypes.bool,
  stripes: stripesShape.isRequired,
};
