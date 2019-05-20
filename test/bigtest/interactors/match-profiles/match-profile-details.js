import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';

@interactor class AssociatedJobProfiles {
  list = new MultiColumnListInteractor('#associated-job-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-associated-job-profiles-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
}

@interactor class MatchProfileDetailsInteractor {
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description]');
  associatedJobProfiles = new AssociatedJobProfiles('[data-test-associated-job-profiles]');
}

export const matchProfileDetails = new MatchProfileDetailsInteractor('#pane-match-profile-details');
