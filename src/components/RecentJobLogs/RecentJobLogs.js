import React from 'react';
import PropTypes from 'prop-types';

import {
  JobLogs,
  DEFAULT_JOB_LOGS_SORT_COLUMNS,
  sortStrings,
} from '@folio/stripes-data-transfer-components';

import JobLogsContainer from '../JobLogsContainer';

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
  checkboxesDisabled = false,
}) => {
  return (
    <JobLogsContainer
      checkboxList={checkboxList}
      checkboxesDisabled={checkboxesDisabled}
    >
      {({ listProps }) => (
        <JobLogs
          sortColumns={sortColumns}
          hasLoaded={haveLogsLoaded}
          contentData={logs}
          formatter={listProps.resultsFormatter}
          mclProps={{ nonInteractiveHeaders: ['selected'] }}
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
  checkboxesDisabled: PropTypes.bool,
};
