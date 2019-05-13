import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';

import { FullScreenFormInteractor } from '.';

class NewMatchProfileInteractor extends FullScreenFormInteractor {
  nameFiled = new TextFieldInteractor('[data-test-name-field]');
  matchField = new SelectInteractor('[data-test-accepted-match-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
}

export const matchProfileForm = new NewMatchProfileInteractor('[data-test-full-screen-form]');
