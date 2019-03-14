import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

@interactor class FileExtensionDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  paneHeaderEditButton = new ButtonInteractor('[data-test-edit-file-extension-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-file-extension-button]');
  deleteButton = new ButtonInteractor('[data-test-delete-file-extension-button]');
  headline = scoped('[data-test-headline]');
  extension = scoped('[data-test-extension]');
  description = scoped('[data-test-description]');
  dataTypes = scoped('[data-test-data-types]');
  importBlocked = scoped('[data-test-import-blocked]');
  confirmationModal = new ConfirmationModalInteractor('#delete-file-extension-modal');

  expandPaneHeaderDropdown() {
    return this
      .paneHeaderDropdown
      .click();
  }
}

export const fileExtensionDetails = new FileExtensionDetailsInteractor('#pane-file-extension-details');
