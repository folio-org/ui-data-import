import { expect } from 'chai';
import { location } from '@bigtest/react';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';

import {
  uploadingJobsDisplay,
  leavePageModal,
  landingPageLink,
  importJobs,
} from '../interactors';
import translation from '../../../translations/ui-data-import/en';

describe('Uploading jobs display', () => {
  describe('when there is upload definition in progress', () => {
    setupApplication({ scenarios: ['upload-definition-in-progress', 'delete-file-success'] });

    beforeEach(function () {
      this.visit('/data-import/job-profile');
    });

    it('renders the correct number of files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(4);
    });

    describe('File item', () => {
      describe('with status NEW', () => {
        const fileItem = uploadingJobsDisplay.files(0);

        it('has correct class', () => {
          expect(uploadingJobsDisplay.files(0).hasUploadingClass).to.be.true;
        });

        it('has correct progress', () => {
          expect(uploadingJobsDisplay.files(0).progress.text).to.equal(translation.waitingForUpload);
        });

        it('has not delete button', () => {
          expect(fileItem.deleteButton.isPresent).to.be.false;
        });
      });

      describe('with status UPLOADING', () => {
        const fileItem = uploadingJobsDisplay.files(1);

        it('has correct class', () => {
          expect(fileItem.hasUploadingClass).to.be.true;
        });

        it('has correct progress', () => {
          expect(fileItem.progress.text).to.equal(translation.uploadingMessage);
        });

        it('has not delete button', () => {
          expect(fileItem.deleteButton.isPresent).to.be.false;
        });
      });

      describe('with status UPLOADED', () => {
        const fileItem = uploadingJobsDisplay.files(2);

        it('has no progress', () => {
          expect(fileItem.progress.isPresent).to.be.false;
        });

        it('has delete button', () => {
          expect(fileItem.deleteButton.isPresent).to.be.true;
        });
      });

      describe('with status ERROR', () => {
        const fileItem = uploadingJobsDisplay.files(3);

        it('has correct classes', () => {
          expect(fileItem.hasDangerClass).to.be.true;
          expect(fileItem.hasFailedClass).to.be.true;
        });

        it('has no progress', () => {
          expect(fileItem.progress.isPresent).to.be.false;
        });

        it('has delete button', () => {
          expect(fileItem.deleteButton.isPresent).to.be.true;
        });

        describe('when deleting', () => {
          beforeEach(async () => {
            await fileItem.deleteButton.click();
          });

          it('has loading animation', () => {
            expect(fileItem.preloader.isPresent).to.be.true;
          });

          describe('after loaded', () => {
            beforeEach(async () => {
              await fileItem.when(() => !fileItem.isPresent);
            });

            it('deletes the file', () => {
              expect(uploadingJobsDisplay.files().length).to.equal(3);
            });
          });
        });
      });

      describe('with status DELETING', () => {
        const fileItem = uploadingJobsDisplay.files(2);

        it('has delete button', () => {
          expect(fileItem.deleteButton.isPresent).to.be.true;
        });

        describe('after clicking delete button', () => {
          beforeEach(async () => {
            await fileItem.deleteButton.click();
          });

          it('renders undo button', () => {
            expect(fileItem.undoButton.isPresent).to.be.true;
          });

          describe('after clicking undo button', () => {
            beforeEach(async () => {
              await fileItem.undoButton.click();
            });

            it('does not delete the file', () => {
              expect(fileItem.hasDangerClass).to.be.false;
            });
          });

          describe('after timeout', () => {
            beforeEach(async () => {
              await new Promise(resolve => setTimeout(resolve, 600));
            });

            it('deletes the file', () => {
              expect(uploadingJobsDisplay.files().length).to.equal(3);
            });
          });
        });
      });
    });
  });

  describe('when there is error upload definition in progress', () => {
    setupApplication({ scenarios: ['upload-definition-with-error-status'] });

    beforeEach(function () {
      this.visit('/data-import/job-profile');
    });

    it('deletes error upload definition', () => {
      expect(uploadingJobsDisplay.emptyMsg.isPresent).to.be.true;
    });
  });

  describe('when unable to delete files', () => {
    setupApplication({ scenarios: ['upload-definition-in-progress', 'delete-file-error'] });

    beforeEach(function () {
      this.visit('/data-import/job-profile');
    });

    const fileItem = uploadingJobsDisplay.files(2);

    beforeEach(async () => {
      await fileItem.deleteButton.click();
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    it('does not delete the file', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(4);
    });

    it('error callout appears', () => {
      expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.true;
    });
  });

  describe('when there is no upload definition in progress', () => {
    setupApplication({ scenarios: ['no-upload-definition-in-progress'] });

    beforeEach(function () {
      this.visit('/data-import/job-profile');
    });

    it('does not have files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(0);
    });

    it('renders empty message with correct wording', () => {
      expect(uploadingJobsDisplay.emptyMsg.text).to.equal(translation.noUploadedFiles);
    });
  });

  describe('when uploading files', () => {
    setupApplication({ scenarios: ['uploading-files'] });

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

    it('renders proper amount of files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(2);
    });

    describe('when navigating away inside application', () => {
      describe('and there are files uploading in progress', () => {
        beforeEach(async () => {
          await new Promise(resolve => setTimeout(resolve, 100)); // wait for the uploading process to begin
          await landingPageLink.click();
        });

        it('renders modal', () => {
          expect(leavePageModal.isPresent).to.be.true;
        });
      });

      describe('after all files were loaded', () => {
        beforeEach(async () => {
          await new Promise(resolve => setTimeout(resolve, 1500)); // wait for all files upload
          await landingPageLink.click();
        });

        it('allows navigation', () => {
          expect(leavePageModal.isPresent).to.be.false;
          expect(location().pathname).to.equal('/data-import');
        });
      });
    });
  });

  describe('when marc records exist', () => {
    setupApplication({ scenarios: ['load-records'] });

    beforeEach(function () {
      this.visit('/data-import/job-profile');
    });

    describe('when load records button is clicked and the API response is successful', () => {
      beforeEach(async () => {
        await uploadingJobsDisplay.paneHeaderDropdown.click();
        await uploadingJobsDisplay.loadRecordsButton.click();
      });

      it.always('error callout does not appear', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.false;
      });
    });

    describe('when load records button is clicked twice and the API response is successful', () => {
      beforeEach(async () => {
        await uploadingJobsDisplay.paneHeaderDropdown.click();
        await uploadingJobsDisplay.loadRecordsButton.click();
        await uploadingJobsDisplay.loadRecordsButton.click();
      });

      it.always('app works correctly and error callout does not appear', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.false;
      });
    });

    describe('when load records button is clicked and the API response is not successful', () => {
      beforeEach(async function () {
        this.server.get('/data-import/uploadDefinitions/:id', {}, 500);
        this.server.get('/data-import-profiles/jobProfiles/:id', {}, 500);
        await uploadingJobsDisplay.paneHeaderDropdown.click();
        await uploadingJobsDisplay.loadRecordsButton.click();
      });

      it('error callout appears', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('when load records button is clicked and the API response is not successful', () => {
      beforeEach(async function () {
        this.server.post('/data-import/uploadDefinitions/:id/processFiles', {}, 500);
        await uploadingJobsDisplay.paneHeaderDropdown.click();
        await uploadingJobsDisplay.loadRecordsButton.click();
      });

      it('error callout appears', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
