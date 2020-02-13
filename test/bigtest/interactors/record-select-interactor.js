import {
  interactor,
  collection,
  attribute,
  isPresent,
} from '@bigtest/interactor';

import DropdownInteractor from '@folio/stripes-components/lib/Dropdown/tests/interactor';

@interactor
export class RecordSelectInteractor {
  items = collection('[data-test-record-item]');
  initialRecord = isPresent('[data-test-initial-record]');
  compareRecord = isPresent('[data-test-compare-record]');
  compareRecordValue = attribute('[data-test-compare-record]', 'data-test-compare-record');
  incomingRecordDropdown = new DropdownInteractor('[data-test-incoming-record-selector]');

  select(val) {
    return this.click(`#${val}`);
  }
}
