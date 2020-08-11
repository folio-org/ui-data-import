import {
  text,
  interactor,
} from '@bigtest/interactor';

@interactor
export class MappedHeaderInteractor {
  mappedLabel = text('[data-test-mapped-label]');
  mappableLabel = text('[data-test-mappable-label]');
  mappingTypeLabel = text('[data-test-mapping-type-label]');
}
