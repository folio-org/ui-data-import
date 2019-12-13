import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';
import { AssociatedProfilesInteractor } from './associated-profiles';

export class AssociatedActionProfiles extends AssociatedProfilesInteractor {
  list = new MultiColumnListInteractor('[data-test-associated-action-profiles]');
  editList = new MultiColumnListInteractor('[data-test-full-screen-form] #associated-actionProfiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-associated-action-profiles] [data-test-select-all-checkbox]');
}
