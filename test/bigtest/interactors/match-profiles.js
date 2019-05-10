import {
  interactor,
  collection,
  clickable,
  blurrable,
  value,
  property,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

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

@interactor class MatchProfilesInteractor {
  list = new MultiColumnListInteractor('#match-profiles-list');
  selectAllCheckBox = new CheckboxInteractor('[data-test-match-profiles] [data-test-select-all]');
  checkBoxes = collection('[data-test-match-profiles] [data-test-select-item]', CheckboxInteractor);
}

export const matchProfiles = new MatchProfilesInteractor('[data-test-job-profiles]');
