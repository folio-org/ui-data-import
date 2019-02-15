import {
  interactor,
  scoped,
  collection,
  text,
} from '@bigtest/interactor';

@interactor class JobsListInteractor {
  emptyMessage = scoped('[data-test-empty-message]');
  jobsList = scoped('[data-test-jobs-list]');

  jobItems = collection('[data-test-job-item]', {
    previewNowButton: scoped('[data-test-preview-now-button]'),
    progressBar: scoped('[data-test-progress-bar]'),
    dateLabelText: text('[data-test-date-label]'),
  });
}

@interactor class JobsPaneInteractor {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  previewJobs = new JobsListInteractor('[data-test-preview-jobs]');
  previewJobsTitleText = text('[data-test-preview-jobs-accordion-title]');
  runningJobs = new JobsListInteractor('[data-test-running-jobs]');
  runningJobsTitleText = text('[data-test-running-jobs-accordion-title]');
}

export const jobsPane = new JobsPaneInteractor('[data-test-jobs-pane]');
