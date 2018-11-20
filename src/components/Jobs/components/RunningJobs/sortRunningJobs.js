import { sortCollection } from '../../../../utils';
import { convertDate } from '../../utils';

const sortRunningJobs = jobs => {
  const correctDateJobs = jobs.map(({ startedDate, ...props }) => ({
    ...props,
    startedDate: convertDate(startedDate, 'number'),
  }));
  const sortedJobs = sortCollection(correctDateJobs, ['-startedDate']);

  return sortedJobs.map(({ startedDate, ...props }) => ({
    ...props,
    startedDate: convertDate(startedDate, 'string'),
  }));
};

export default sortRunningJobs;
