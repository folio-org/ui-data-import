import React from 'react';

import { UploadingJobsDisplay } from '../components';
import {
  isTestEnv,
  DEFAULT_TIMEOUT_BEFORE_JOB_DELETION,
} from '../utils';

let timeoutBeforeFileDeletion = DEFAULT_TIMEOUT_BEFORE_JOB_DELETION;

if (isTestEnv()) {
  timeoutBeforeFileDeletion = 500;
}

export const JobProfile = () => <UploadingJobsDisplay timeoutBeforeFileDeletion={timeoutBeforeFileDeletion} />;
