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
    beforeEach(async function () {
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [new File([], 'file.js'), new File([], 'file2.js')],
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

  describe('when dropping files with invalid extensions', () => {
    beforeEach(async function () {
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [new File([], 'server.js'), new File([], 'index.html')],
        },
      });
    });

    it('renders modal', () => {
      expect(importJobs.fileExtensionsModal.isPresent).to.be.true;
    });

    describe('closes modal', () => {
      beforeEach(async () => {
        await importJobs.fileExtensionsModal.cancelButton.click();
      });

      it('correctly', () => {
        expect(importJobs.fileExtensionsModal.isPresent).to.be.false;
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
