import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor class JobProfileDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  paneHeaderEditButton = new ButtonInteractor('[data-test-edit-job-profile-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-job-profile-button]');
  headline = scoped('[data-test-headline]');

  expandPaneHeaderDropdown() {
    return this
      .paneHeaderDropdown
      .click();
  }
}

export const jobProfileDetails = new JobProfileDetailsInteractor('#pane-job-profile-details');
