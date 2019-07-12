import {
  interactor,
  collection,
  property,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';

@interactor
class MappingProfilesInteractor {
  list = new MultiColumnListInteractor('#mapping-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  newMappingProfileButton = new ButtonInteractor('[data-test-new-button]');
  searchField = new TextFieldInteractor('#input-mapping-profiles-search');
  searchSubmitButton = new ButtonInteractor('[data-test-search-and-sort-submit]');
  searchSubmitButtonDisabled = property('[data-test-search-and-sort-submit]', 'disabled');
}

export const mappingProfiles = new MappingProfilesInteractor();
