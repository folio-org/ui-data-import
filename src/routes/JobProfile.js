import React from 'react';

import { UploadingJobsDisplay } from '../components';
import { isTestEnv } from '../utils';

let timeoutBeforeFileDeletion = 10000;

if (isTestEnv()) {
  timeoutBeforeFileDeletion = 500;
}

export const JobProfile = () => <UploadingJobsDisplay timeoutBeforeFileDeletion={timeoutBeforeFileDeletion} />;
