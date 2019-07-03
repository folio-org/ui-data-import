import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';

class ActionProfileFormInteractor extends FullScreenFormInteractor {
  nameField = new TextFieldInteractor('[data-test-name-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
  associatedMappingProfileAccordion = new AccordionInteractor('#actionProfileFormAssociatedMappingProfileAccordion');
  confirmEditModal = new ConfirmationModalInteractor('#confirm-edit-action-profile-modal');
}

export const actionProfileForm = new ActionProfileFormInteractor('[data-test-full-screen-form]');
