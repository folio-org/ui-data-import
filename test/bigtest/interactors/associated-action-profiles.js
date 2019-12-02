import {
  interactor,
  collection,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor
export class AssociatedActionProfiles {
  list = new MultiColumnListInteractor('[data-test-associated-action-profiles]');
  selectAllCheckBox = new CheckboxInteractor('[data-test-associated-action-profiles] [data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  actionProfilesLinks = collection('[data-test-profile-link]', ButtonInteractor);
}
