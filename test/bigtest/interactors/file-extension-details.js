import {
  interactor,
  scoped,
} from '@bigtest/interactor';

@interactor class FileExtensionDetailsInteractor {
  static defaultScope = '#ModuleContainer';

  headline = scoped('[data-test-headline]');
  extension = scoped('[data-test-extension]');
  description = scoped('[data-test-description]');
  dataTypes = scoped('[data-test-data-types]');
  importBlocked = scoped('[data-test-import-blocked]');
}

export const fileExtensionDetails = new FileExtensionDetailsInteractor('#pane-file-extension-details');
