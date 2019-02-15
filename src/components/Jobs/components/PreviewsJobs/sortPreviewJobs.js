import { sortCollection } from '../../../../utils';
import {
  DATE_TYPES,
  convertDate,
} from '../../utils';
import { JOB_STATUSES } from '../../../../utils/constants';

const {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} = JOB_STATUSES;

const statusSequence = [READY_FOR_PREVIEW, PREPARING_FOR_PREVIEW];
const sortByDates = (a, b) => {
  const { uiStatus: statusA } = a;
  const { uiStatus: statusB } = b;
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

  const isSortingByStartedDate = statusA === PREPARING_FOR_PREVIEW && statusB === PREPARING_FOR_PREVIEW;

  if (isSortingByStartedDate) {
    return startedDateB - startedDateA;
  }

  const isSortingByCompletedDate = statusA === READY_FOR_PREVIEW && statusB === READY_FOR_PREVIEW;

  if (isSortingByCompletedDate) {
    return completedDateB - completedDateA;
  }

  return 0;
};
const sortingOptions = [
  {
    propertyName: 'uiStatus',
    sequence: statusSequence,
  },
  sortByDates,
];

export const sortPreviewJobs = jobs => {
  return sortCollection(jobs, sortingOptions);
};
