import {
  PREPARING_FOR_PREVIEW,
  READY_FOR_PREVIEW,
  RUNNING,
} from '../../jobStatuses';

const jobMetaTypes = {
  [PREPARING_FOR_PREVIEW]: job => ({
    showProgress: true,
    showPreview: false,
    date: job.startedDate,
    dateLabel: 'began',
  }),
  [READY_FOR_PREVIEW]: job => ({
    showProgress: false,
    showPreview: true,
    date: job.completedDate,
    dateLabel: 'ended',
  }),
  [RUNNING]: job => ({
    showProgress: true,
    showPreview: false,
    date: job.startedDate,
    dateLabel: 'began',
  }),
};

export default jobMetaTypes;
