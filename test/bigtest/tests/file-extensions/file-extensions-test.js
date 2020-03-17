import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { fileExtensions } from '../../interactors';
import { setupApplication } from '../../helpers';

describe('File extensions', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success', 'restore-default-file-extensions-success', 'fetch-users'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  describe('table', () => {
    it('renders proper amount of items', () => {
      expect(fileExtensions.list.rowCount).to.equal(3);
    });

    describe('upon search', () => {
      beforeEach(async () => {
        await fileExtensions.searchFiled.fill('marc');
        await fileExtensions.searchFiled.fill('mar');
        await fileExtensions.searchSubmitButton.click();
      });

      it('renders proper amount of items', () => {
        expect(fileExtensions.list.rowCount).to.equal(1);
      });
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

  describe('action menu', () => {
    it('is present', () => {
      expect(fileExtensions.actionMenu.isMenuPresent).to.be.true;
    });

    it('contains restore default file extensions button', () => {
      expect(fileExtensions.actionMenu.restoreDefaultButton.isPresent).to.be.true;
    });

    it('contains new file extensions button', () => {
      expect(fileExtensions.actionMenu.newProfileButton.isPresent).to.be.true;
    });
  });

  describe('restore default file extensions confirmation modal', () => {
    it('is not visible when restore file extensions button is not clicked', () => {
      expect(fileExtensions.confirmationModal.isPresent).to.be.false;
    });

    describe('is visible', () => {
      beforeEach(async () => {
        await fileExtensions.actionMenu.click();
        await fileExtensions.actionMenu.restoreDefaultButton.click();
      });

      it('when restore default file extensions button is clicked', () => {
        expect(fileExtensions.confirmationModal.isPresent).to.be.true;
      });
    });

    describe('disappears', () => {
      beforeEach(async () => {
        await fileExtensions.actionMenu.click();
        await fileExtensions.actionMenu.restoreDefaultButton.click();
        await fileExtensions.confirmationModal.cancelButton.click();
      });

      it('when cancel button is clicked', () => {
        expect(fileExtensions.confirmationModal.isPresent).to.be.false;
      });
    });

    describe('upon click on confirm button initiate the restoring process and in case of network error', () => {
      beforeEach(async function () {
        this.server.post('/data-import/fileExtensions/restore/default', {}, 500);
        await fileExtensions.actionMenu.click();
        await fileExtensions.actionMenu.restoreDefaultButton.click();
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

  describe('restore default file extension confirmation modal', () => {
    describe('upon click on confirm button initiate the restoring process and in case of success', () => {
      beforeEach(async () => {
        await fileExtensions.actionMenu.click();
        await fileExtensions.actionMenu.restoreDefaultButton.click();
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

  describe('restore default file extensions confirmation modal', () => {
    describe('upon click on confirm button twice only initiate the restoring process once and in case of success', () => {
      beforeEach(async () => {
        await fileExtensions.actionMenu.click();
        await fileExtensions.actionMenu.restoreDefaultButton.click();
        await fileExtensions.confirmationModal.confirmButton.click();
        await fileExtensions.confirmationModal.confirmButton.click();
      });

      it('list renders proper amount of items', () => {
        expect(fileExtensions.list.rowCount).to.equal(2);
      });
    });
  });
});
