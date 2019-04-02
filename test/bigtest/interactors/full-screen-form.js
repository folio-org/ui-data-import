import {
  interactor,
  scoped,
  property,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor
export class FullScreenFormInteractor {
  submitFormButton = new ButtonInteractor('[data-test-submit-button]');
  submitFormButtonDisabled = property('[data-test-submit-button]', 'disabled');
  closeButton = new ButtonInteractor('[data-test-close-button]');
  paneHeaderDropdown = scoped('[class*="paneHeaderCenterButton"]');
  paneHeaderCancelButton = new ButtonInteractor('[data-test-cancel-button]');
  callout = new CalloutInteractor();

  expandPaneHeaderDropdown() {
    return this
      .paneHeaderDropdown
      .click();
  }
}

export const fullScreenForm = new FullScreenFormInteractor('[data-test-full-screen-form]');
