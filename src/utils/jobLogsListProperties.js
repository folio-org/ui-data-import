import React from 'react';
import { FormattedMessage } from 'react-intl';

import { CheckboxHeader } from '../components/ListTemplate/HeaderTemplates';

export const DEFAULT_JOB_LOG_COLUMNS = [
  'fileName',
  'status',
  'totalRecords',
  'jobProfileName',
  'completedDate',
  'runBy',
  'hrId',
];

export const DEFAULT_JOB_LOG_COLUMNS_WIDTHS = {
  selected: '40px',
  hrId: '60px',
  totalRecords: '80px',
};

export const getJobLogsListColumnMapping = ({ isAllSelected, handleSelectAllCheckbox }) => {
  return {
    selected: (
      <CheckboxHeader
        checked={isAllSelected}
        onChange={handleSelectAllCheckbox}
      />
    ),
    fileName: <FormattedMessage id="ui-data-import.fileName" />,
    status: <FormattedMessage id="ui-data-import.status" />,
    totalRecords: <FormattedMessage id="ui-data-import.records" />,
    jobProfileName: <FormattedMessage id="ui-data-import.jobProfileName" />,
    completedDate: <FormattedMessage id="ui-data-import.jobCompletedDate" />,
    runBy: <FormattedMessage id="ui-data-import.runBy" />,
    hrId: <FormattedMessage id="ui-data-import.jobExecutionHrId" />,
  };
};
