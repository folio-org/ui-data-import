import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { AssociatedJobProfiles } from '../associated-job-profiles';

@interactor class ActionProfileDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  dropdownEditButton = new ButtonInteractor('[data-test-edit-item-menu-button]');
  dropdownDeleteButton = new ButtonInteractor('[data-test-delete-item-menu-button]');
  dropdownDuplicateButton = new ButtonInteractor('[data-test-duplicate-item-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-item-button]');
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  reactTo = scoped('[data-test-react-to]');
  action = scoped('[data-test-action]');
  folioRecord = scoped('[data-test-folio-record]');
  associatedJobProfiles = new AssociatedJobProfiles('[data-test-associated-job-profiles]');
  associatedMappingProfile = new MultiColumnListInteractor('[data-test-associated-mapping-profiles]');
  confirmationModal = new ConfirmationModalInteractor('#delete-action-profile-modal');
  callout = new CalloutInteractor();

  expandPaneHeaderDropdown() {
    return this.paneHeaderDropdown.click();
  }
}

export const actionProfileDetails = new ActionProfileDetailsInteractor('#pane-action-profile-details');
