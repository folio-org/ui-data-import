import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor class FileExtensionsInteractor {
  static defaultScope = '[data-test-file-extensions]';

  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  restoreDefaultFileExtensionsButton = new ButtonInteractor('[data-test-restore-default-file-extensions-button]');
  newFileExtensionButton = new ButtonInteractor('[data-test-new-button]');
  list = new MultiColumnListInteractor('#file-extensions-list');
  confirmationModal = new ConfirmationModalInteractor('#restore-default-file-extensions-modal');
  callout = new CalloutInteractor();
  searchFiled = new TextFieldInteractor('#input-file-extensions-search');
  searchSubmitButton = new ButtonInteractor('[data-test-search-and-sort-submit]');

  expandPaneHeaderDropdown() {
    return this
      .paneHeaderDropdown
      .click();
  }
}

export const fileExtensions = new FileExtensionsInteractor();
