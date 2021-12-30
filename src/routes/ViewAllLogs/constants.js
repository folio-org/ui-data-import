import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FILE_STATUSES } from '../../utils';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

export const FILTERS = {
  ERRORS: 'statusAny',
  DATE: 'completedDate',
  JOB_PROFILE: 'profileIdAny',
  USER: 'userId',
  SINGLE_RECORD_IMPORTS: 'singleRecordImports',
};

export const FILTER_OPTIONS = {
  ERRORS: [
    {
      value: COMMITTED,
      label: <FormattedMessage id="ui-data-import.filter.option.no" />,
    },
    {
      value: ERROR,
      label: <FormattedMessage id="ui-data-import.filter.option.yes" />,
    },
  ],
  SINGLE_RECORD_IMPORTS: [
    {
      value: 'no',
      label: <FormattedMessage id="ui-data-import.filter.option.no" />,
    },
    {
      value: 'yes',
      label: <FormattedMessage id="ui-data-import.filter.option.yes" />,
    },
  ],
};

export const SORT_MAP = {
  fileName: 'file_name',
  status: 'status',
  hrId: 'hrid',
  jobProfileName: 'job_profile_name',
  totalRecords: 'progress_total',
  completedDate: 'completed_date',
  runBy: 'job_user_first_name job_user_last_name',
};
