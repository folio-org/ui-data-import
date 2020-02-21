/* eslint-disable max-classes-per-file */
import {
  interactor,
  text,
  clickable,
  triggerable,
  hasClass,
  Interactor,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import css from '../../../src/components/ImportJobs/components/FileUploader/FileUploader.css';

class FileExtensionsModal extends ConfirmationModalInteractor {
  header = new Interactor('[data-test-file-extensions-modal-header]');
}

@interactor class ImportJobsInteractor {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  errorMsg = text('[data-test-error-msg]');
  triggerDrop = triggerable('drop');
  triggerDragEnter = triggerable('dragenter');
  triggerDragLeave = triggerable('dragleave');
  hasActiveClass = hasClass(css.activeUpload);
  callout = new CalloutInteractor();
}

@interactor class ReturnToAssignJobsInteraction {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  errorMsg = text('[data-test-error-msg]');
  deleteButtonClick = clickable('[class*="deleteButton"]');
  resumeButtonClick = clickable('[class*="submitButton"]');
  callout = new CalloutInteractor();
}

export const importJobs = new ImportJobsInteractor('[class*="upload---"]');
export const returnToAssignJobs = new ReturnToAssignJobsInteraction('[data-test-return-to-assign-jobs]');
export const fileExtensionsModal = new FileExtensionsModal('#file-extensions-modal');
