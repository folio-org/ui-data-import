import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import { AssociatedJobProfiles } from '../associated-job-profiles';
import { RecordSelectInteractor } from '../record-select-interactor';
import { MatchCriteriaInteractor } from '../match-criteria-interactor';

@interactor class MatchProfileDetailsInteractor {
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  dropdownEditButton = new ButtonInteractor('[data-test-edit-item-menu-button]');
  dropdownDeleteButton = new ButtonInteractor('[data-test-delete-item-menu-button]');
  dropdownDuplicateButton = new ButtonInteractor('[data-test-duplicate-item-menu-button]');
  editButton = new ButtonInteractor('[data-test-edit-item-button]');
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  detailsAccordion = new AccordionInteractor('#match-profiles-view');
  recordTypesSelect = new RecordSelectInteractor('[data-test-choose-existing-record]');
  matchCriteria = new MatchCriteriaInteractor('#match-criteria');
  associatedJobProfiles = new AssociatedJobProfiles('[data-test-associated-job-profiles]');
  confirmationModal = new ConfirmationModalInteractor('#delete-match-profile-modal');
  callout = new CalloutInteractor();

  expandPaneHeaderDropdown() {
    return this.paneHeaderDropdown.click();
  }
}

export const matchProfileDetails = new MatchProfileDetailsInteractor('#pane-match-profile-details');
