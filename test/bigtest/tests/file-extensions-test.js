import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { fileExtensions } from '../interactors';
import { setupApplication } from '../helpers';

describe('File extensions table', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  it('renders', () => {
    expect(fileExtensions.list.isPresent).to.be.true;
  });

  it('renders proper amount of items', () => {
    expect(fileExtensions.list.rowCount).to.equal(3);
  });

  describe('can sort', () => {
    beforeEach(async () => {
      await fileExtensions.list.headers(0).click();
    });

    it('by first column', () => {
      expect(fileExtensions.list.rowCount).to.equal(3);
    });

    describe('and', () => {
      beforeEach(async () => {
        await fileExtensions.list.headers(1).click();
      });

      it('by second column', () => {
        expect(fileExtensions.list.rowCount).to.equal(3);
      });
    });
  });
});

describe('File extensions has restore default file extensions button which', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  it('is not visible when pane dropdown is closed', () => {
    expect(fileExtensions.restoreDefaultFileExtensionsButton.isVisible).to.be.false;
  });

  describe('is visible', () => {
    beforeEach(async function () {
      await fileExtensions.expandPaneHeaderDropdown();
    });

    it('when pane dropdown is opened', () => {
      expect(fileExtensions.restoreDefaultFileExtensionsButton.isVisible).to.be.true;
    });
  });
});

describe('Restore default file extensions confirmation modal', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success', 'restore-default-file-extensions-error'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  it('is not visible when restore file extensions button is not clicked', () => {
    expect(fileExtensions.confirmationModal.isPresent).to.be.false;
  });

  describe('is visible', () => {
    beforeEach(async function () {
      await fileExtensions.expandPaneHeaderDropdown();
      await fileExtensions.restoreDefaultFileExtensionsButton.click();
    });

    it('when restore default file extensions button is clicked', () => {
      expect(fileExtensions.confirmationModal.isPresent).to.be.true;
    });
  });

  describe('disappears', () => {
    beforeEach(async function () {
      await fileExtensions.expandPaneHeaderDropdown();
      await fileExtensions.restoreDefaultFileExtensionsButton.click();
      await fileExtensions.confirmationModal.cancelButton.click();
    });

    it('when cancel button is clicked', () => {
      expect(fileExtensions.confirmationModal.isPresent).to.be.false;
    });
  });

  describe('upon click on confirm button initiate the restoring process and in case of network error', () => {
    beforeEach(async function () {
      await fileExtensions.expandPaneHeaderDropdown();
      await fileExtensions.restoreDefaultFileExtensionsButton.click();
      await fileExtensions.confirmationModal.confirmButton.click();
    });

    it('disappears', () => {
      expect(fileExtensions.confirmationModal.isPresent).to.be.false;
    });

    it('the error toast appears', () => {
      expect(fileExtensions.callout.errorCalloutIsPresent).to.be.true;
    });
  });
});

describe('Restore default file extension confirmation modal', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success', 'restore-default-file-extensions-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  describe('upon click on confirm button initiate the restoring process and in case of success', () => {
    beforeEach(async function () {
      await fileExtensions.expandPaneHeaderDropdown();
      await fileExtensions.restoreDefaultFileExtensionsButton.click();
      await fileExtensions.confirmationModal.confirmButton.click();
    });

    it('disappears', () => {
      expect(fileExtensions.confirmationModal.isPresent).to.be.false;
    });

    it.always('the error toast does not appear', () => {
      expect(fileExtensions.callout.errorCalloutIsPresent).to.be.false;
    });

    it('list renders proper amount of items', () => {
      expect(fileExtensions.list.rowCount).to.equal(2);
    });
  });
});

describe('Restore default file extensions confirmation modal', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success', 'restore-default-file-extensions-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  describe('upon click on confirm button twice only initiate the restoring process once and in case of success', () => {
    beforeEach(async function () {
      await fileExtensions.expandPaneHeaderDropdown();
      await fileExtensions.restoreDefaultFileExtensionsButton.click();
      await fileExtensions.confirmationModal.confirmButton.click();
      await fileExtensions.confirmationModal.confirmButton.click();
    });

    it('list renders proper amount of items', () => {
      expect(fileExtensions.list.rowCount).to.equal(2);
    });
  });
});
