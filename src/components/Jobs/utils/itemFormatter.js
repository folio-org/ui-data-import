import React from 'react';

import { Job } from '../components/Job';

export const itemFormatter = job => (
  <Job
    key={job.hrId}
    job={job}
  />
);
