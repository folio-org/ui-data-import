import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { AssociatedActionProfiles } from '../associated-action-profiles';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor
class MappingProfileDetailsInteractor {
  actionMenu = new ActionMenuInteractor();
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description]');
  incomingRecordType = scoped('[data-test-incoming-record-type]');
  folioRecordType = scoped('[data-test-folio-record-type]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  associatedActionProfiles = new AssociatedActionProfiles('[data-test-associated-action-profiles]');
  confirmationModal = new ConfirmationModalInteractor('#delete-mapping-profile-modal');
  callout = new CalloutInteractor();
}

export const mappingProfileDetails = new MappingProfileDetailsInteractor('#pane-mapping-profile-details');
