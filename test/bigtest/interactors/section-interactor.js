import {
  interactor,
  text,
  isPresent,
} from '@bigtest/interactor';

@interactor
export class SectionInteractor {
  label = text('[class*="headline---"]');
  hasContent = isPresent('[class*="content---"]');
  hasCheckbox = isPresent('[class*="checkbox---"]');
}
