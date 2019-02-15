import { interactor, count } from '@bigtest/interactor';

@interactor class FileExtensionsInteractor {
  count = count('a[class*="mclRow--"]');
}

export const fileExtensions = new FileExtensionsInteractor('[data-test-file-extensions]');
