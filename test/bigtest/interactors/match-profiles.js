import {
  interactor,
  collection,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor class MatchProfilesInteractor {
  list = new MultiColumnListInteractor('#match-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
}

export const matchProfiles = new MatchProfilesInteractor();
