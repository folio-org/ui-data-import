import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { setupApplication } from '../helpers';
import FileExtensionsPane from '../interactors/file-extensions';

describe('File extensions table', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  it('renders', () => {
    expect(FileExtensionsPane.isPresent).to.be.true;
  });
});
