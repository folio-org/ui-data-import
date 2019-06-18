import {
  interactor,
  collection,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';

@interactor
class ActionProfilesInteractor {
  list = new MultiColumnListInteractor('#action-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
}

export const actionProfiles = new ActionProfilesInteractor();
