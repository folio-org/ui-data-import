import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor class JobProfileDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  dropdownEditButton = new ButtonInteractor('[data-test-edit-item-menu-button]');
  dropdownDuplicateButton = new ButtonInteractor('[data-test-duplicate-item-menu-button]');
  dropdownDeleteButton = new ButtonInteractor('[data-test-delete-item-menu-button]');
  dropdownRunButton = new ButtonInteractor('[data-test-run-item-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-item-button]');
  runButton = new ButtonInteractor('[data-test-run-item-button]');
  headline = scoped('[data-test-headline]');
  acceptedDataType = scoped('[data-test-accepted-data-type]');
  description = scoped('[data-test-description]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  jobsUsingThisProfile = new MultiColumnListInteractor('#jobs-using-this-profile');
  confirmationModal = new ConfirmationModalInteractor('#delete-job-profile-modal');
  runConfirmationModal = new ConfirmationModalInteractor('#run-job-profile-modal');
  callout = new CalloutInteractor();

  expandPaneHeaderDropdown() {
    return this.paneHeaderDropdown.click();
  }
}

export const jobProfileDetails = new JobProfileDetailsInteractor('#pane-job-profile-details');
