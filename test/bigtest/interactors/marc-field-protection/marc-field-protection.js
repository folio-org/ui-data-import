import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class MARCFieldProtection {
  hasList = isPresent('#editList-marc-field-protection');
  rowCount = count('#editList-marc-field-protection [class^="editListRow---"]');
}

export const marcFieldProtection = new MARCFieldProtection();
