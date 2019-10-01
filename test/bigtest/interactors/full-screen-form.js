import {
  interactor,
  property,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor
export class FullScreenFormInteractor {
  submitFormButton = new ButtonInteractor('[data-test-submit-button]');
  submitFormButtonDisabled = property('[data-test-submit-button]', 'disabled');
  closeButton = new ButtonInteractor('[data-test-close-button]');
  paneHeaderCloseButton = new ButtonInteractor('[data-test-header-close-button]');
  callout = new CalloutInteractor();
}

export const fullScreenForm = new FullScreenFormInteractor('[data-test-full-screen-form]');
