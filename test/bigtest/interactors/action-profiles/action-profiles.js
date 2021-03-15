import {
  interactor,
  collection,
  property,
  scoped,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import ModalInteractor from '@folio/stripes-components/lib/Modal/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor
class ActionProfilesInteractor {
  actionMenu = scoped('#pane-results', ActionMenuInteractor);
  list = new MultiColumnListInteractor('#action-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  searchField = new TextFieldInteractor('[data-test-search-form-field]');
  searchSubmitButton = new ButtonInteractor('[data-test-search-form-submit]');
  searchSubmitButtonDisabled = property('[data-test-search-form-submit]', 'disabled');
  exceptionModal = new ModalInteractor('#delete-actionProfiles-exception-modal');
  exceptionModalCloseButton = new ButtonInteractor('[data-test-exception-modal-close-button]');
}

export const actionProfiles = new ActionProfilesInteractor();
