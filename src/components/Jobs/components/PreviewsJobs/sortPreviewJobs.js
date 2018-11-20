import { sortCollection } from '../../../../utils';
import {
  DATE_TYPES,
  convertDate,
} from '../../utils';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../../jobStatuses';

const statusSequence = [READY_FOR_PREVIEW, PREPARING_FOR_PREVIEW];
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

  if (statusA === PREPARING_FOR_PREVIEW && statusB === PREPARING_FOR_PREVIEW) {
    return startedDateB - startedDateA;
  }

  if (statusA === READY_FOR_PREVIEW && statusB === READY_FOR_PREVIEW) {
    return completedDateB - completedDateA;
  }

  return 0;
};
const sortingOptions = [
  {
    property: 'status',
    sequence: statusSequence,
  },
  sortByDates,
];

const sortPreviewJobs = jobs => sortCollection(jobs, sortingOptions);

export default sortPreviewJobs;
