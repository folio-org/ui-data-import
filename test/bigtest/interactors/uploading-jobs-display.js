import { interactor } from '@bigtest/interactor';

@interactor class UploadingJobsDisplay {}

export const uploadingJobsDisplay = new UploadingJobsDisplay('[data-test-uploading-jobs-display]');
