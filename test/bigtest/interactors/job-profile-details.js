import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor class JobProfileDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  dropdownEditButton = new ButtonInteractor('[data-test-edit-job-profile-menu-button]');
  dropdownDeleteButton = new ButtonInteractor('[data-test-delete-job-profile-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-job-profile-button]');
  headline = scoped('[data-test-headline]');
  acceptedDataType = scoped('[data-test-accepted-data-type]');
  description = scoped('[data-test-description]');
  jobsUsingThisProfile = new MultiColumnListInteractor('#jobs-using-this-profile');
  confirmationModal = new ConfirmationModalInteractor('#delete-job-profile-modal');
  callout = new CalloutInteractor();

  expandPaneHeaderDropdown() {
    return this.paneHeaderDropdown.click();
  }
}

export const jobProfileDetails = new JobProfileDetailsInteractor('#pane-job-profile-details');
