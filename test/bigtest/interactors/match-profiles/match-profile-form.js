import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';
import { RecordTypesSelectInteractor } from '../record-types-select-interactor';

class NewMatchProfileInteractor extends FullScreenFormInteractor {
  nameField = new TextFieldInteractor('[data-test-name-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
  confirmEditModal = new ConfirmationModalInteractor('#confirm-edit-match-profile-modal');
  recordTypesSelect = new RecordTypesSelectInteractor('[data-test-record-types-select]');
}

export const matchProfileForm = new NewMatchProfileInteractor('[data-test-full-screen-form]');
