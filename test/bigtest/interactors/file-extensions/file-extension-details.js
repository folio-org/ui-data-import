import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor class FileExtensionDetailsInteractor {
  actionMenu = new ActionMenuInteractor();
  headline = scoped('[data-test-headline]');
  extension = scoped('[data-test-extension]');
  description = scoped('[data-test-description]');
  dataTypes = scoped('[data-test-data-types]');
  importBlocked = scoped('[data-test-import-blocked]');
  confirmationModal = new ConfirmationModalInteractor('#delete-file-extension-modal');
}

export const fileExtensionDetails = new FileExtensionDetailsInteractor('#pane-file-extension-details');
