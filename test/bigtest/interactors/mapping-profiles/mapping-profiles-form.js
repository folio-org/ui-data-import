import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';
import { AssociatedActionProfiles } from '../associated-action-profiles';

class MappingProfileFormInteractor extends FullScreenFormInteractor {
  nameField = new TextFieldInteractor('[data-test-name-field]');
  incomingRecordTypeField = new SelectInteractor('[data-test-incoming-record-type-field]');
  folioRecordTypeField = new SelectInteractor('[data-test-folio-record-type-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
  confirmEditModal = new ConfirmationModalInteractor('#confirm-edit-action-profile-modal');
  associatedActionProfilesAccordion = new AccordionInteractor('#mappingProfileFormAssociatedActionProfileAccordion');
  associatedActionProfiles = new AssociatedActionProfiles('[data-test-full-screen-form] #associated-actionProfiles-list');
}

export const mappingProfileForm = new MappingProfileFormInteractor('[data-test-full-screen-form]');
