import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { location } from '@bigtest/react';

import translation from '../../../translations/ui-data-import/en';
import { setupApplication } from '../helpers';
import {
  importJobs,
  returnToAssignJobs,
  fileExtensionsModal,
} from '../interactors';

describe('Import files with no previous draft jobs', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/data-import');
  });

  it('renders', () => {
    expect(importJobs.isPresent).to.be.true;
    expect(returnToAssignJobs.isPresent).to.be.false;
  });

  it('has correct title', () => {
    expect(importJobs.title).to.be.equal(translation.uploadTitle);
  });
});

describe('ImportJobs component', () => {
  setupApplication({ scenarios: ['uploading-files'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  describe('onDrop', () => {
    beforeEach(async () => {
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [
            new File([], 'file.js'),
            new File([], 'file2.js'),
          ],
        },
      });
    });

    it('navigates to ChooseJobsProfile page', () => {
      expect(location().pathname).to.be.equal('/data-import/job-profile');
    });
  });

  describe('after onDragEnter', () => {
    beforeEach(async () => {
      await importJobs.triggerDragEnter();
    });

    it('has correct title', () => {
      expect(importJobs.title).to.be.equal(translation.activeUploadTitle);
    });

    it('has correct class', () => {
      expect(importJobs.hasActiveClass).to.be.true;
    });
  });

  describe('after onDragLeave', () => {
    beforeEach(async () => {
      await importJobs.triggerDragEnter();
      await importJobs.triggerDragLeave();
    });

    it('has correct title', () => {
      expect(importJobs.title).to.be.equal(translation.uploadTitle);
    });

    it('has correct class', () => {
      expect(importJobs.hasActiveClass).to.be.false;
    });
  });

  describe('when dropping files with different file extensions', () => {
    beforeEach(async () => {
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [
            new File([], 'server.js'),
            new File([], 'index.html'),
          ],
        },
      });
    });

    it('renders modal', () => {
      expect(fileExtensionsModal.isPresent).to.be.true;
    });

    it('modal has correct header', () => {
      expect(fileExtensionsModal.header.text).to.be.equal(translation['modal.fileExtensions.inconsistent.header']);
    });

    describe('when cancel button clicked', () => {
      beforeEach(async () => {
        await fileExtensionsModal.cancelButton.click();
      });

      it('closes modal', () => {
        expect(fileExtensionsModal.isPresent).to.be.false;
      });
    });

    describe('when "Choose other files" button clicked', () => {
      beforeEach(async () => {
        await fileExtensionsModal.confirmButton.click();
      });

      it('closes modal', () => {
        expect(fileExtensionsModal.isPresent).to.be.false;
      });
    });
  });
});

describe('Import files with previous draft jobs', () => {
  setupApplication({ scenarios: ['return-to-assign-jobs'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  it('renders', () => {
    expect(importJobs.isPresent).to.be.false;
    expect(returnToAssignJobs.isPresent).to.be.true;
  });

  it('has correct title', () => {
    expect(returnToAssignJobs.title).to.be.equal(translation['returnToAssign.message']);
  });

  describe('delete button', () => {
    beforeEach(async () => {
      await returnToAssignJobs.deleteButtonClick();
      await returnToAssignJobs.deleteButtonClick();
    });

    it('resets to initial state', () => {
      expect(importJobs.isPresent).to.be.true;
      expect(returnToAssignJobs.isPresent).to.be.false;
    });
  });

  describe('resume button', () => {
    beforeEach(async () => {
      await returnToAssignJobs.resumeButtonClick();
    });

    it('navigates to "Choose jobs profile" page', () => {
      expect(location().pathname).to.be.equal('/data-import/job-profile');
    });
  });
});

describe('ImportJobs error handling:', () => {
  describe('when unable to create upload definition because of network error', () => {
    setupApplication({ scenarios: ['create-upload-definition-error'] });

    beforeEach(async function () {
      this.visit('/data-import');
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [
            new File([], 'TAMU-Gen_55.mrc'),
            new File([], 'TAMU-Gen.mrc'),
          ],
        },
      });
    });

    it('error message is shown', () => {
      expect(importJobs.errorMsg).to.exist;
    });
  });

  describe('when there is not enough space to create upload definition on the server', () => {
    setupApplication({ scenarios: ['create-upload-definition-not-enough-memory-error'] });

    beforeEach(async function () {
      this.visit('/data-import');
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [
            new File([], 'TAMU-Gen_55.mrc'),
            new File([], 'TAMU-Gen.mrc'),
          ],
        },
      });
    });

    it('renders modal', () => {
      expect(fileExtensionsModal.isPresent).to.be.true;
    });

    it('modal has correct header', () => {
      expect(fileExtensionsModal.header.text).to.be.equal(translation['modal.fileExtensions.memoryLimit.header']);
    });

    describe('when cancel button clicked', () => {
      beforeEach(async () => {
        await fileExtensionsModal.cancelButton.click();
      });

      it('closes modal', () => {
        expect(fileExtensionsModal.isPresent).to.be.false;
      });
    });

    describe('when "Choose other files" button clicked', () => {
      beforeEach(async () => {
        await fileExtensionsModal.confirmButton.click();
      });

      it('closes modal', () => {
        expect(fileExtensionsModal.isPresent).to.be.false;
      });
    });
  });

  describe('when there is error due to blocked file extensions', () => {
    setupApplication({ scenarios: ['create-upload-definition-blocked-imports-error'] });

    beforeEach(async function () {
      this.visit('/data-import');
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [
            new File([], 'TAMU-Gen_55.zip'),
            new File([], 'TAMU-Gen.zip'),
          ],
        },
      });
    });

    it('renders modal', () => {
      expect(fileExtensionsModal.isPresent).to.be.true;
    });

    it('modal has correct header', () => {
      expect(fileExtensionsModal.header.text).to.be.equal(translation['modal.fileExtensions.blocked.header']);
    });

    describe('when cancel button clicked', () => {
      beforeEach(async () => {
        await fileExtensionsModal.cancelButton.click();
      });

      it('closes modal', () => {
        expect(fileExtensionsModal.isPresent).to.be.false;
      });
    });

    describe('when "Choose other files" button clicked', () => {
      beforeEach(async () => {
        await fileExtensionsModal.confirmButton.click();
      });

      it('closes modal', () => {
        expect(fileExtensionsModal.isPresent).to.be.false;
      });
    });
  });
});
