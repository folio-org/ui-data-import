import { sortBy } from '../../../../utils';
import { convertDate } from '../../utils';

const sortRunningJobs = jobs => {
  const correctDateJobs = jobs.map(({ startedDate, ...props }) => ({
    ...props,
    startedDate: convertDate(startedDate, 'number'),
  }));
  const sortedJobs = sortBy(correctDateJobs, ['-startedDate']);

  return sortedJobs.map(({ startedDate, ...props }) => ({
    ...props,
    startedDate: convertDate(startedDate, 'string'),
  }));
};

export default sortRunningJobs;
