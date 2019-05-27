import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';

@interactor class AssociatedJobProfiles {
  list = new MultiColumnListInteractor('#associated-job-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-associated-job-profiles-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  jobProfilesLinks = collection('[data-test-job-profile-link]', ButtonInteractor);
}

@interactor class MatchProfileDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  dropdownEditButton = new ButtonInteractor('[data-test-edit-match-profile-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-match-profile-button]');
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description]');
  associatedJobProfiles = new AssociatedJobProfiles('[data-test-associated-job-profiles]');

  expandPaneHeaderDropdown() {
    return this.paneHeaderDropdown.click();
  }
}

export const matchProfileDetails = new MatchProfileDetailsInteractor('#pane-match-profile-details');
