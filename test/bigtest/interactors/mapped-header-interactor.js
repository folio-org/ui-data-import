import {
  attribute,
  interactor,
} from '@bigtest/interactor';

@interactor
export class MappedHeaderInteractor {
  mappedLabel = attribute('[data-test-mapped-label]', 'data-test-mapped-label');
  mappableLabel = attribute('[data-test-mappable-label]', 'data-test-mappable-label');
}
