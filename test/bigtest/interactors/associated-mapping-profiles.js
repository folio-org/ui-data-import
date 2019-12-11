import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';
import { AssociatedProfilesInteractor } from './associated-profiles';

export class AssociatedMappingProfiles extends AssociatedProfilesInteractor {
  list = new MultiColumnListInteractor('[data-test-associated-mapping-profiles]');
  editList = new MultiColumnListInteractor('[data-test-full-screen-form] #associated-mappingProfiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-associated-mapping-profiles] [data-test-select-all-checkbox]');
}
