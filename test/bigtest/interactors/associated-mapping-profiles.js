import {
  interactor,
  collection,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor
export class AssociatedMappingProfiles {
  list = new MultiColumnListInteractor('[data-test-associated-mapping-profiles]');
  selectAllCheckBox = new CheckboxInteractor('[data-test-associated-mapping-profiles] [data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  mappingProfilesLinks = collection('[data-test-profile-link]', ButtonInteractor);
}
