import {
  interactor,
  collection,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor
export class AssociatedJobProfiles {
  list = new MultiColumnListInteractor('#associated-job-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-associated-job-profiles-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  jobProfilesLinks = collection('[data-test-job-profile-link]', ButtonInteractor);
}
