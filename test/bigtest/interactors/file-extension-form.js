import { interactor } from '@bigtest/interactor';

@interactor class NewFileExtensionInteractor {}

export const newFileExtensionForm = new NewFileExtensionInteractor('[data-test-file-extension-form]');
