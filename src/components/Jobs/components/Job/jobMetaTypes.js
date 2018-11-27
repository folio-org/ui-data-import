import {
  PROCESSING_IN_PROGRESS,
  PROCESSING_FINISHED,
  PARSING_IN_PROGRESS,
} from '../../jobStatuses';

const jobMetaTypes = {
  [PROCESSING_IN_PROGRESS]: job => ({
    showProgress: true,
    showPreview: false,
    date: job.startedDate,
    dateLabel: 'began',
  }),
  [PROCESSING_FINISHED]: job => ({
    showProgress: false,
    showPreview: true,
    date: job.completedDate,
    dateLabel: 'ended',
  }),
  [PARSING_IN_PROGRESS]: job => ({
    showProgress: true,
    showPreview: false,
    date: job.startedDate,
    dateLabel: 'began',
  }),
};

export default jobMetaTypes;
