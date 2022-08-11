import React, { memo } from 'react';

import { AccordionSet } from '@folio/stripes/components';

import { RunningJobs } from './components';

import css from './Jobs.css';

export const Jobs = memo(() => (
  <div className={css.jobsPane}>
    <AccordionSet>
      <RunningJobs />
    </AccordionSet>
  </div>
));
