import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';
import { RecordSelectInteractor } from '../record-select-interactor';
import { MatchCriteriaInteractor } from '../match-criteria-interactor';
import { InputInteractor } from '../input-interactor';
import { TextAreaInteractor } from '../textarea-interactor';

class NewMatchProfileInteractor extends FullScreenFormInteractor {
  nameField = new InputInteractor('[data-test-name-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
  confirmEditModal = new ConfirmationModalInteractor('#confirm-edit-match-profile-modal');
  recordTypesSelect = new RecordSelectInteractor('[data-test-choose-existing-record]');
  matchCriteria = new MatchCriteriaInteractor('#match-criteria');
}

export const matchProfileForm = new NewMatchProfileInteractor('[data-test-full-screen-form]');
