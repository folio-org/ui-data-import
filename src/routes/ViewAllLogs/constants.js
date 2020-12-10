import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FILE_STATUSES } from '../../utils';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

export const FILTERS = {
  ERRORS: 'status',
  DATE: 'completedDate',
  JOB_PROFILE: 'jobProfileInfo',
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

export const LOGS_FILTER = `(status any "${COMMITTED} ${ERROR}")`;
