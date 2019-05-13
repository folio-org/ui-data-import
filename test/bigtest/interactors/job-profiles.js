import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor class Dropdown {
  newJobProfileButton = new ButtonInteractor('[data-test-new-job-profile-menu-button]');
  exportSelectedButton = new ButtonInteractor('[data-test-export-selected-job-profiles-menu-button]');
  selectAllButton = new ButtonInteractor('[data-test-select-all-job-profiles-menu-button]');
  deselectAllButton = new ButtonInteractor('[data-test-deselect-all-job-profiles-menu-button]');
}

@interactor class JobProfilesInteractor {
  paneHeaderDropdown = scoped('#pane-results', Dropdown);
  list = new MultiColumnListInteractor('#job-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-select-all-checkbox]');
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  newJobProfileButton = new ButtonInteractor('[data-test-new-button]');
  searchFiled = new TextFieldInteractor('#input-job-profiles-search');
  searchSubmitButton = new ButtonInteractor('[data-test-search-and-sort-submit]');
  clearSearchButton = new ButtonInteractor('#input-job-profiles-clear-search-button');
  callout = new CalloutInteractor();

  async clearSearchButtonClick() {
    await this.searchFiled.focus();

    return this.clearSearchButton.click();
  }
}

export const jobProfiles = new JobProfilesInteractor();
