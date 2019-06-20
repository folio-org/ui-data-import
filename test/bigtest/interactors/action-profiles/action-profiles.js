import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor
class ActionProfilesInteractor {
  actionMenu = scoped('#pane-results', ActionMenuInteractor);
  list = new MultiColumnListInteractor('#action-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  newActionProfileButton = new ButtonInteractor('[data-test-new-button]');
}

export const actionProfiles = new ActionProfilesInteractor();
