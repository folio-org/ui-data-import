import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import FileExtensionForm from '../interactors/file-extension-form';

describe('Create new file extension form', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions?layer=create');
  });

  it('renders', () => {
    expect(FileExtensionForm.isPresent).to.be.true;
  });
});
