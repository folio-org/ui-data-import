import {
  interactor,
  collection,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor
export class AssociatedJobProfiles {
  list = new MultiColumnListInteractor('[data-test-associated-job-profiles]');
  selectAllCheckBox = new CheckboxInteractor('[data-test-associated-job-profiles] [data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  jobProfilesLinks = collection('[data-test-job-profile-link]', ButtonInteractor);
}
