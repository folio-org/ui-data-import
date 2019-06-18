import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor
class ActionProfilesInteractor {
  actionMenu = scoped('#pane-results', ActionMenuInteractor);
  list = new MultiColumnListInteractor('#action-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
}

export const actionProfiles = new ActionProfilesInteractor();
