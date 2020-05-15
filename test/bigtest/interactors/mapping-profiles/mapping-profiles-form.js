import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';
import { AssociatedActionProfiles } from '../associated-action-profiles';
import { HoldingsDetailsAccordion } from './details/editable/holdings-details-interactor';
import { InstanceDetailsAccordion } from './details/editable/instance-details-interactor';
import { ItemDetailsAccordion } from './details/editable/item-details-interactor';
import { MARCTableInteractor } from '../marc-table-interactor';

class MappingProfileFormInteractor extends FullScreenFormInteractor {
  nameField = new TextFieldInteractor('#mapping-profiles-form [data-test-name-field]');
  incomingRecordTypeField = new SelectInteractor('#mapping-profiles-form [data-test-incoming-record-type-field]');
  folioRecordTypeField = new SelectInteractor('#mapping-profiles-form [data-test-folio-record-type-field]');
  descriptionField = new TextAreaInteractor('#mapping-profiles-form [data-test-description-field]');
  holdingsDetails = new HoldingsDetailsAccordion('#mapping-profile-details');
  instanceDetails = new InstanceDetailsAccordion('#mapping-profile-details');
  itemDetails = new ItemDetailsAccordion('#mapping-profile-details');
  marcDetailsTable = new MARCTableInteractor('#mapping-profiles-form');
  confirmEditModal = new ConfirmationModalInteractor('#confirm-edit-action-profile-modal');
  associatedActionProfilesAccordion = new AccordionInteractor('#mappingProfileFormAssociatedActionProfileAccordion');
  associatedActionProfiles = new AssociatedActionProfiles('[data-test-full-screen-form] #associated-actionProfiles-list');
}

export const mappingProfileForm = new MappingProfileFormInteractor('[data-test-full-screen-form]');
