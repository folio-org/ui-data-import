import { sortCollection } from '../../../../utils';
import {
  DATE_TYPES,
  convertDate,
} from '../../utils';
import {
  PROCESSING_FINISHED,
  PROCESSING_IN_PROGRESS,
} from '../../jobStatuses';

const statusSequence = [PROCESSING_FINISHED, PROCESSING_IN_PROGRESS];
const sortByDates = (a, b) => {
  const { status: statusA } = a;
  const { status: statusB } = b;
  let {
    startedDate: startedDateA,
    completedDate: completedDateA,
  } = a;
  let {
    startedDate: startedDateB,
    completedDate: completedDateB,
  } = b;

  startedDateA = convertDate(startedDateA, DATE_TYPES.number);
  startedDateB = convertDate(startedDateB, DATE_TYPES.number);
  completedDateA = convertDate(completedDateA, DATE_TYPES.number);
  completedDateB = convertDate(completedDateB, DATE_TYPES.number);

  const isSortingByStartedDate = statusA === PROCESSING_IN_PROGRESS && statusB === PROCESSING_IN_PROGRESS;

  if (isSortingByStartedDate) {
    return startedDateB - startedDateA;
  }

  const isSortingByCompletedDate = statusA === PROCESSING_FINISHED && statusB === PROCESSING_FINISHED;

  if (isSortingByCompletedDate) {
    return completedDateB - completedDateA;
  }

  return 0;
};
const sortingOptions = [
  {
    propertyName: 'status',
    sequence: statusSequence,
  },
  sortByDates,
];

const sortPreviewJobs = jobs => {
  return sortCollection(jobs, sortingOptions);
};

export default sortPreviewJobs;
