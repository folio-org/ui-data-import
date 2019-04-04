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

  describe('has cancel button which', () => {
    it('is not visible when pane dropdown is closed', () => {
      expect(fullScreenForm.paneHeaderCancelButton.isVisible).to.be.false;
    });

    describe('is visible', () => {
      beforeEach(async () => {
        await fullScreenForm.expandPaneHeaderDropdown();
      });

      it('when pane dropdown is opened', () => {
        expect(fullScreenForm.paneHeaderCancelButton.isVisible).to.be.true;
      });
    });

    describe('cancels creation of file extension', () => {
      beforeEach(async () => {
        await fullScreenForm.expandPaneHeaderDropdown();
        await fullScreenForm.paneHeaderCancelButton.click();
      });

      it('when clicked', () => {
        expect(fullScreenForm.isPresent).to.be.false;
      });
    });
  });
});
