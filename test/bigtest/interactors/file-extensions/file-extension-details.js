import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

@interactor class FileExtensionDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  dropdownEditButton = new ButtonInteractor('[data-test-edit-item-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-item-button]');
  deleteButton = new ButtonInteractor('[data-test-delete-item-menu-button]');
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
