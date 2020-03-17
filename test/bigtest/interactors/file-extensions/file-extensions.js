import { interactor } from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor class FileExtensionsInteractor {
  actionMenu = new ActionMenuInteractor();
  list = new MultiColumnListInteractor('#file-extensions-list');
  confirmationModal = new ConfirmationModalInteractor('#restore-default-records-modal');
  callout = new CalloutInteractor();
  searchFiled = new TextFieldInteractor('#input-file-extensions-search');
  searchSubmitButton = new ButtonInteractor('[data-test-search-and-sort-submit]');
}

export const fileExtensions = new FileExtensionsInteractor();
