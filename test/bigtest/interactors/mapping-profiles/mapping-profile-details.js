import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { AssociatedActionProfiles } from '../associated-action-profiles';
import { ActionMenuInteractor } from '../action-menu-interactor';
import { HoldingsDetailsAccordion } from './details/static/holdings-details-interactor';
import { InstanceDetailsAccordion } from './details/static/instance-details-interactor';
import { ItemDetailsAccordion } from './details/static/item-details-interactor';

@interactor
class MappingProfileDetailsInteractor {
  actionMenu = new ActionMenuInteractor();
  headline = scoped('[data-test-headline]');
  description = scoped('[data-test-description-field] [data-test-kv-value]');
  incomingRecordType = scoped('[data-test-incoming-record-type-field] [data-test-kv-value]');
  folioRecordType = scoped('[data-test-folio-record-type-field] [data-test-kv-value]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  holdingsDetails = new HoldingsDetailsAccordion('#mapping-profile-details');
  instanceDetails = new InstanceDetailsAccordion('#mapping-profile-details');
  itemDetails = new ItemDetailsAccordion('#mapping-profile-details');
  associatedActionProfiles = new AssociatedActionProfiles('[data-test-associated-action-profiles]');
  confirmationModal = new ConfirmationModalInteractor('#delete-mapping-profile-modal');
  callout = new CalloutInteractor();
}

export const mappingProfileDetails = new MappingProfileDetailsInteractor('#pane-mapping-profile-details');
