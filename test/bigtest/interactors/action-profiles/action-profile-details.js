import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { AssociatedJobProfiles } from '../associated-job-profiles';
import { AssociatedMappingProfiles } from '../associated-mapping-profiles';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor class ActionProfileDetailsInteractor {
  actionMenu = new ActionMenuInteractor();
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  reactTo = scoped('[data-test-react-to]');
  action = scoped('[data-test-action]');
  folioRecord = scoped('[data-test-folio-record]');
  associatedJobProfiles = new AssociatedJobProfiles('[data-test-associated-job-profiles]');
  associatedMappingProfile = new AssociatedMappingProfiles('[data-test-associated-mapping-profiles]');
  confirmationModal = new ConfirmationModalInteractor('#delete-action-profile-modal');
  callout = new CalloutInteractor();
}

export const actionProfileDetails = new ActionProfileDetailsInteractor('[data-test-pane-action-profile-details]');
