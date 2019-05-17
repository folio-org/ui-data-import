import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';

class NewMatchProfileInteractor extends FullScreenFormInteractor {
  nameField = new TextFieldInteractor('[data-test-name-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
}

export const matchProfileForm = new NewMatchProfileInteractor('[data-test-full-screen-form]');
