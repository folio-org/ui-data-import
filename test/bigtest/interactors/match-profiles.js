import {
  interactor,
  collection,
  property,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor class MatchProfilesInteractor {
  list = new MultiColumnListInteractor('#match-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  searchField = new TextFieldInteractor('#input-match-profiles-search');
  searchSubmitButton = new ButtonInteractor('[data-test-search-and-sort-submit]');
  searchSubmitButtonDisabled = property('[data-test-search-and-sort-submit]', 'disabled');
}

export const matchProfiles = new MatchProfilesInteractor();
