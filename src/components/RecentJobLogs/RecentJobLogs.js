import React from 'react';
import PropTypes from 'prop-types';

import {
  JobLogs,
  DEFAULT_JOB_LOGS_SORT_COLUMNS,
  sortStrings,
  sortDates,
} from '@folio/stripes-data-transfer-components';

import JobLogsContainer from '../JobLogsContainer';

import { checkboxListShape } from '../../utils';

const sortColumns = {
  ...DEFAULT_JOB_LOGS_SORT_COLUMNS,
  fileName: {
    sortFn: sortStrings,
    useFormatterFn: true,
  },
  status: {
    sortFn: sortStrings,
    useFormatterFn: true,
  },
  startedDate: {
    sortFn: sortDates,
    useFormatterFn: false,
  },
};

export const RecentJobLogs = ({
  logs,
  haveLogsLoaded,
  checkboxList,
  checkboxesDisabled = false,
}) => {
  const logs2 = [{
    'id': 'daed8452-c4eb-4826-81e5-267de605c9d8',
    'hrId': 22,
    'parentJobId': 'daed8452-c4eb-4826-81e5-267de605c9d8',
    'subordinationType': 'PARENT_SINGLE',
    'jobProfileName': 'Default - Create SRS MARC Authority',
    'jobProfileInfo': {
      'id': '6eefa4c6-bbf7-4845-ad82-de7fc5abd0e3',
      'name': 'Default - Create SRS MARC Authority',
      'dataType': 'MARC',
      'hidden': false
    },
    'sourcePath': 'MARC_Auth_(Elizabeth, -  010 valid prefix, 001 - not valid).mrc',
    'fileName': 'MARC_Auth_(Elizabeth, -  010 valid prefix, 001 - not valid).mrc',
    'runBy': {
      'firstName': 'DIKU',
      'lastName': 'ADMINISTRATOR'
    },
    'progress': {
      'jobExecutionId': 'daed8452-c4eb-4826-81e5-267de605c9d8',
      'current': 1,
      'total': 1
    },
    'startedDate': '2023-06-07T10:08:29.680+00:00',
    'completedDate': '2023-06-07T10:08:44.091+00:00',
    'status': 'COMMITTED',
    'uiStatus': 'RUNNING_COMPLETE',
    'userId': '961af2ea-27e0-5aea-bce7-0529282adafe'
  }, {
    'id': 'daed8452-c4eb-4826-81e5-267de605c9d8',
    'hrId': 22,
    'parentJobId': 'daed8452-c4eb-4826-81e5-267de605c9d8',
    'subordinationType': 'PARENT_SINGLE',
    'jobProfileName': 'Default - Create instance and SRS MARC Bib',
    'jobProfileInfo': {
      'id': '6eefa4c6-bbf7-4845-ad82-de7fc5abd0e3',
      'name': 'Default - Create instance and SRS MARC Bib',
      'dataType': 'MARC',
      'hidden': false
    },
    'sourcePath': 'MARC_Auth_(Elizabeth, -  010 valid prefix, 001 - not valid).mrc',
    'fileName': 'MARC_Auth_(Elizabeth, -  010 valid prefix, 001 - not valid).mrc',
    'runBy': {
      'firstName': 'DIKU',
      'lastName': 'ADMINISTRATOR'
    },
    'progress': {
      'jobExecutionId': 'daed8452-c4eb-4826-81e5-267de605c9d8',
      'current': 1,
      'total': 1
    },
    'startedDate': '2023-06-07T10:08:29.680+00:00',
    'completedDate': '2023-06-07T10:08:44.091+00:00',
    'status': 'COMMITTED',
    'uiStatus': 'RUNNING_COMPLETE',
    'userId': '961af2ea-27e0-5aea-bce7-0529282adafe'
  }];
  return (
    <JobLogsContainer
      checkboxList={checkboxList}
      checkboxesDisabled={checkboxesDisabled}
    >
      {({ listProps }) => (
        <JobLogs
          sortColumns={sortColumns}
          hasLoaded={haveLogsLoaded}
          contentData={logs2}
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
