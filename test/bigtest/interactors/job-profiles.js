import {
  interactor,
  collection,
  clickable,
  blurrable,
  value,
  property,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor class CheckboxInteractor {
  static defaultScope = '[class*=checkbox---]';

  clickLabel = clickable('label');
  blurInput = blurrable('input');
  inputValue = value('input');
  isChecked = property('input', 'checked');

  clickAndBlur() {
    return this
      .clickLabel()
      .blurInput();
  }
}

@interactor class JobProfilesInteractor {
  list = new MultiColumnListInteractor('#job-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-job-profiles] [data-test-select-all]');
  checkBoxes = collection('[data-test-job-profiles] [data-test-select-item]', CheckboxInteractor);
  newJobProfileButton = new ButtonInteractor('[data-test-new-button]');
  searchFiled = new TextFieldInteractor('#input-job-profiles-search');
  searchSubmitButton = new ButtonInteractor('[data-test-search-and-sort-submit]');
}

export const jobProfiles = new JobProfilesInteractor('[data-test-job-profiles]');
