import { FILE_STATUSES } from '../../utils/constants';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

export const FILTERS = {
  ERRORS: 'status',
  DATE: 'completedDate',
  JOB_PROFILE: 'jobProfileInfo',
  USER: 'userId',
};

export const FILTER_OPTIONS = {
  ERRORS: [
    {
      value: COMMITTED,
      label: 'No',
    },
    {
      value: ERROR,
      label: 'Yes',
    },
  ],
};

export const LOGS_FILTER = `(status any "${COMMITTED} ${ERROR}")`;
