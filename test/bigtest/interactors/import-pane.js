import {
  interactor,
  text,
  clickable,
} from '@bigtest/interactor';

@interactor class ImportJobsInteractor {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  errorMsg = text('[data-test-error-msg]');
}

@interactor class ReturnToAssignJobsInteracation {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  errorMsg = text('[data-test-error-msg]');
  deleteFileExtension = clickable('[class*="deleteBtn"]');
}

export const importJobs = new ImportJobsInteractor('[class*="upload---"]');
export const returnToAssignJobs = new ReturnToAssignJobsInteracation('[data-test-return-to-assign-jobs]');
