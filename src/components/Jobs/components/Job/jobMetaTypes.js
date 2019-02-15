import { JOB_STATUSES } from '../../../../utils/constants';

export const jobMetaTypes = {
  [JOB_STATUSES.PREPARING_FOR_PREVIEW]: job => ({
    showProgress: true,
    showPreview: false,
    date: job.startedDate,
    dateLabel: 'began',
  }),
  [JOB_STATUSES.READY_FOR_PREVIEW]: job => ({
    showProgress: false,
    showPreview: true,
    date: job.completedDate,
    dateLabel: 'ended',
  }),
  [JOB_STATUSES.RUNNING]: job => ({
    showProgress: true,
    showPreview: false,
    date: job.startedDate,
    dateLabel: 'began',
  }),
};
