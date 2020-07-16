import { isPresent } from '@bigtest/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';
import { RecordSelectInteractor } from '../record-select-interactor';
import { MatchCriteriaInteractor } from '../match-criteria-interactor';

class NewMatchProfileInteractor extends FullScreenFormInteractor {
  isLoaded = isPresent('[name="description"]');
  nameField = new TextFieldInteractor('[data-test-name-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
  confirmEditModal = new ConfirmationModalInteractor('#confirm-edit-match-profile-modal');
  recordTypesSelect = new RecordSelectInteractor('[data-test-choose-existing-record]');
  matchCriteria = new MatchCriteriaInteractor('#match-criteria');

  whenLoaded() {
    return this.when(() => this.isLoaded).timeout(5000);
  }
}

export const matchProfileForm = new NewMatchProfileInteractor('[data-test-full-screen-form]');
