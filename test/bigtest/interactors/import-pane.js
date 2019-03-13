import {
  interactor,
  text,
  clickable,
  triggerable,
  hasClass,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

import css from '../../../src/components/ImportJobs/components/FileUploader/FileUploader.css';

@interactor class ImportJobsInteractor {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  errorMsg = text('[data-test-error-msg]');
  triggerDrop = triggerable('drop');
  triggerDragEnter = triggerable('dragenter');
  triggerDragLeave = triggerable('dragleave');
  fileExtensionsModal = new ConfirmationModalInteractor('#file-extensions-modal');
  hasActiveClass = hasClass(css.activeUpload);
}

@interactor class ReturnToAssignJobsInteraction {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  errorMsg = text('[data-test-error-msg]');
  deleteButtonClick = clickable('[class*="deleteButton"]');
  resumeButtonClick = clickable('[class*="submitButton"]');
}

export const importJobs = new ImportJobsInteractor('[class*="upload---"]');
export const returnToAssignJobs = new ReturnToAssignJobsInteraction('[data-test-return-to-assign-jobs]');
