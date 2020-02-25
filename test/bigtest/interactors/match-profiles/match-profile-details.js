import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import { AssociatedJobProfiles } from '../associated-job-profiles';
import { RecordSelectInteractor } from '../record-select-interactor';
import { MatchCriteriaInteractor } from '../match-criteria-interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor class MatchProfileDetailsInteractor {
  actionMenu = new ActionMenuInteractor();
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  detailsAccordion = new AccordionInteractor('#match-profile-details');
  recordTypesSelect = new RecordSelectInteractor('[data-test-choose-existing-record]');
  matchCriteria = new MatchCriteriaInteractor('#match-criteria');
  associatedJobProfiles = new AssociatedJobProfiles('[data-test-associated-job-profiles]');
  confirmationModal = new ConfirmationModalInteractor('#delete-match-profile-modal');
  callout = new CalloutInteractor();
}

export const matchProfileDetails = new MatchProfileDetailsInteractor('#pane-match-profile-details');
