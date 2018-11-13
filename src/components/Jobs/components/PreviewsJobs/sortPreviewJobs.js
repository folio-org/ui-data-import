import { sortBy } from '../../../../utils';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../../jobStatuses';

const statusSequence = [READY_FOR_PREVIEW, PREPARING_FOR_PREVIEW];

const sortingOptions = [{ property: 'status', sequence: statusSequence }, '-startedDate'];

const datesToMilliseconds = jobs => jobs.map(({ startedDate, ...job }) => ({
  ...job,
  startedDate: new Date(startedDate).valueOf(),
}));

const datesToStrings = jobs => jobs.map(({ startedDate, ...job }) => ({
  ...job,
  startedDate: new Date(startedDate).toString(),
}));

const sortPreviewJobs = jobs => {
  const correctDateJobs = datesToMilliseconds(jobs);
  const sortedJobs = sortBy(correctDateJobs, sortingOptions);

  return datesToStrings(sortedJobs);
};

export default sortPreviewJobs;
