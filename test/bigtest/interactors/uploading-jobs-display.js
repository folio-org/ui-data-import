import {
  interactor,
  collection,
  hasClass,
  scoped,
  text,
} from '@bigtest/interactor';

import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

import css from '../../../src/components/UploadingJobsDisplay/components/FileItem/FileItem.css';

@interactor
class LandingPageLink {
  static defaultScope = '#ModuleMainHeading';
}

@interactor class FileItem {
  hasUploadingClass = hasClass(css.fileItemUploading);
  hasDangerClass = hasClass(css.fileItemDanger);
  hasFailedClass = hasClass(css.fileItemFailed);
  errorMsg = text('[data-test-error-msg]');
  preloader = scoped('[data-test-preloader]');
  progress = scoped('[data-test-progress]');
  deleteButton = scoped('[data-test-delete-button]');
  undoButton = scoped('[data-test-undo-button]');
}

@interactor class UploadingJobsDisplay {
  files = collection('[data-test-file-item]', FileItem);
  callout = new CalloutInteractor();
  emptyMsg = scoped('[data-test-empty-msg]');
}

export const landingPageLink = new LandingPageLink();
export const leavePageModal = new ConfirmationModalInteractor('#leave-page-modal');
export const uploadingJobsDisplay = new UploadingJobsDisplay('[data-test-uploading-jobs-display]');
