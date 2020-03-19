import {
  isPresent,
  interactor,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor
export class ActionMenuInteractor {
  isMenuPresent = isPresent('[data-test-pane-header-actions-button]');
  newProfileButton = new ButtonInteractor('[data-test-new-item-menu-button]');
  exportSelectedButton = new ButtonInteractor('[data-test-export-selected-items-menu-button]');
  selectAllButton = new ButtonInteractor('[data-test-select-all-items-menu-button]');
  deselectAllButton = new ButtonInteractor('[data-test-deselect-all-items-menu-button]');
  loadRecordsButton = new ButtonInteractor('[data-test-load-records]');
  restoreDefaultButton = new ButtonInteractor('[data-test-restore-default-file-extensions-button]');
  editProfile = new ButtonInteractor('[data-test-edit-item-menu-button]');
  duplicateProfile = new ButtonInteractor('[data-test-duplicate-item-menu-button]');
  deleteProfile = new ButtonInteractor('[data-test-delete-item-menu-button]');
  runProfile = new ButtonInteractor('[data-test-run-item-menu-button]');
}
