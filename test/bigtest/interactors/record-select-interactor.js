import {
  interactor,
  collection,
} from '@bigtest/interactor';

@interactor
export class RecordSelectInteractor {
  items = collection('[data-test-record-item]');

  select(val) {
    return this.click(`#${val}`);
  }
}
