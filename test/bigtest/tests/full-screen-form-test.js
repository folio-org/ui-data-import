import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import { fullScreenForm } from '../interactors';

describe('Full screen form', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions?layer=create');
  });

  describe('header has close button which closes the form', () => {
    beforeEach(async () => {
      await fullScreenForm.paneHeaderCloseButton.click();
    });

    it('when clicked', () => {
      expect(fullScreenForm.isPresent).to.be.false;
    });
  });

  describe('footer has close button which closes the form', () => {
    beforeEach(async () => {
      await fullScreenForm.closeButton.click();
    });

    it('when clicked', () => {
      expect(fullScreenForm.isPresent).to.be.false;
    });
  });
});
