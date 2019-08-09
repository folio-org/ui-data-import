import {
  interactor,
  collection,
} from '@bigtest/interactor';

@interactor
export class RecordTypesSelectInteractor {
  items = collection('[class^="item---"]');

  select(val) {
    return this.click(`#${val}`);
  }
}
