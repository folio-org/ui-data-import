import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';

class MappingProfileFormInteractor extends FullScreenFormInteractor {
  nameField = new TextFieldInteractor('[data-test-name-field]');
  incomingRecordTypeField = new SelectInteractor('[data-test-incoming-record-type-field]');
  folioRecordTypeField = new SelectInteractor('[data-test-folio-record-type-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
}

export const mappingProfileForm = new MappingProfileFormInteractor('[data-test-full-screen-form]');
