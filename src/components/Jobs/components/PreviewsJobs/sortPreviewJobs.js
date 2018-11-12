import { sortBy } from '../../../../utils';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../../jobStatuses';

const statusSequence = [READY_FOR_PREVIEW, PREPARING_FOR_PREVIEW];

const sortingOptions = [{ property: 'status', statusSequence }, 'startedDate'];

const normalizeDates = jobs => jobs.map(({ startedDate, ...job }) => ({
  ...job,
  startedDate: new Date(startedDate).valueOf(),
}));

const sortPreviewJobs = jobs => {
  const correctDateJobs = normalizeDates(jobs);

  return sortBy(correctDateJobs, sortingOptions);
};

export default sortPreviewJobs;
