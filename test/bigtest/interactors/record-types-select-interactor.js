import {
  interactor,
  collection,
} from '@bigtest/interactor';

@interactor
class RecordSelect {
  items = collection('[data-test-record-item]');

  select(val) {
    return this.click(`#${val}`);
  }
}

@interactor
export class RecordTypesSelectInteractor {
  chooseIncomingRecord = new RecordSelect('[data-test-choose-incoming-record]');
  chooseExistingRecord = new RecordSelect('[data-test-choose-existing-record]');
}
