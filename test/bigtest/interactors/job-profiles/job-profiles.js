import {
  interactor,
  collection,
  scoped,
  property,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { CheckboxInteractor } from '../checkbox-interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor class JobProfilesInteractor {
  actionMenu = scoped('#pane-results', ActionMenuInteractor);
  list = new MultiColumnListInteractor('#job-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  searchFiled = new TextFieldInteractor('[data-test-search-form-field]');
  searchSubmitButton = new ButtonInteractor('[data-test-search-form-submit]');
  searchSubmitButtonDisabled = property('[data-test-search-form-submit]', 'disabled');
  clearSearchButton = new ButtonInteractor('#input-job-profiles-search-field-clear-button');
  callout = new CalloutInteractor();

  async clearSearchButtonClick() {
    await this.searchFiled.focus();

    return this.clearSearchButton.click();
  }
}

export const jobProfiles = new JobProfilesInteractor();
