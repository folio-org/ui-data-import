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
class MappingProfilesInteractor {
  actionMenu = scoped('#pane-results', ActionMenuInteractor);
  list = new MultiColumnListInteractor('#mapping-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  searchField = new TextFieldInteractor('#input-mapping-profiles-search');
  searchSubmitButton = new ButtonInteractor('[data-test-search-and-sort-submit]');
  searchSubmitButtonDisabled = property('[data-test-search-and-sort-submit]', 'disabled');
  exceptionModal = new ModalInteractor('#delete-mappingProfiles-exception-modal');
  exceptionModalCloseButton = new ButtonInteractor('[data-test-exception-modal-close-button]');
}

export const mappingProfiles = new MappingProfilesInteractor();
