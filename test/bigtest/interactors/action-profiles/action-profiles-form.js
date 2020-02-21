/* eslint-disable max-classes-per-file */
import {
  collection,
  interactor,
} from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';
import { AssociatedJobProfiles } from '../associated-job-profiles';
import { AssociatedMappingProfiles } from '../associated-mapping-profiles';

@interactor
class ActionFieldInteractor {
  select = new SelectInteractor('[data-test-action-field]');
  options = collection('[data-test-action-field] option');
}

@interactor
class FolioRecordTypeFieldInteractor {
  select = new SelectInteractor('[data-test-folio-record-type-field]');
  options = collection('[data-test-folio-record-type-field] option');
}

class ActionProfileFormInteractor extends FullScreenFormInteractor {
  nameField = new TextFieldInteractor('[data-test-name-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
  actionField = new ActionFieldInteractor();
  folioRecordTypeField = new FolioRecordTypeFieldInteractor();
  associatedMappingProfileAccordion = new AccordionInteractor('#actionProfileFormAssociatedMappingProfileAccordion');
  associatedJobProfilesAccordion = new AccordionInteractor('#actionProfileFormAssociatedJobProfileAccordion');
  confirmEditModal = new ConfirmationModalInteractor('#confirm-edit-action-profile-modal');
  associatedJobProfiles = new AssociatedJobProfiles('[data-test-full-screen-form] #associated-jobProfiles-list');
  associatedMappingProfile = new AssociatedMappingProfiles('[data-test-full-screen-form] #associated-mappingProfiles-list');
}

export const actionProfileForm = new ActionProfileFormInteractor('[data-test-full-screen-form]');
