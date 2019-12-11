import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';
import { AssociatedProfilesInteractor } from './associated-profiles';

export class AssociatedJobProfiles extends AssociatedProfilesInteractor {
  list = new MultiColumnListInteractor('[data-test-associated-job-profiles]');
  editList = new MultiColumnListInteractor('[data-test-full-screen-form] #associated-jobProfiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-associated-job-profiles] [data-test-select-all-checkbox]');
}
