import React from 'react';

import { Job } from '../components/Job';

export const itemFormatter = job => {
  return (
    <Job
      key={job.hrId}
      job={job}
    />
  );
};
