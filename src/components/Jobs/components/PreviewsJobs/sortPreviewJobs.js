import { sortBy } from '../../../../utils';
import { convertDate } from '../../utils';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../../jobStatuses';

const statusSequence = [READY_FOR_PREVIEW, PREPARING_FOR_PREVIEW];
const sortingOptions = [
  {
    property: 'status',
    sequence: statusSequence,
  },
  '-startedDate',
];

const sortPreviewJobs = jobs => {
  const correctDateJobs = jobs.map(({ startedDate, ...props }) => ({
    ...props,
    startedDate: convertDate(startedDate, 'number'),
  }));
  const sortedJobs = sortBy(correctDateJobs, sortingOptions);

  return sortedJobs.map(({ startedDate, ...props }) => ({
    ...props,
    startedDate: convertDate(startedDate, 'string'),
  }));
};

export default sortPreviewJobs;
