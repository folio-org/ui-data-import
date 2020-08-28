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
  jobProfiles,
  jobProfileDetails,
  jobProfileForm,
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
        }).timeout(5000);

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
        }).timeout(5000);

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

      // eslint-disable-next-line no-only-tests/no-only-tests
      describe.skip('with status ERROR', () => {
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
    setupApplication({
      scenarios: [
        'no-upload-definition-in-progress',
        'fetch-file-extensions-success',
        'fetch-job-profiles-success',
        'fetch-users',
        'fetch-tags',
        'tags-enabled',
      ],
    });

    beforeEach(async function () {
      this.visit('/data-import/job-profile');
      await jobProfileForm.whenLoaded();
    });

    it('does not have files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(0);
    });

    it('renders empty message with correct wording', () => {
      expect(uploadingJobsDisplay.emptyMsg.text).to.equal(translation.noUploadedFiles);
    });

    describe('job profiles list', () => {
      it('renders all available job profiles', () => {
        expect(jobProfiles.list.rowCount).to.be.equal(3);
      });

      it('does not have actions button', () => {
        expect(jobProfiles.actionMenu.isPresent).to.be.false;
      });
    });

    describe('job profile details pane', () => {
      beforeEach(async () => {
        await jobProfiles.list.rows(0).click();
      });

      it('opens upon click on row', () => {
        expect(jobProfileDetails.isPresent).to.be.true;
      });

      it('has actions button', () => {
        expect(jobProfileDetails.actionMenu.isMenuPresent).to.be.true;
      });

      describe('pane actions button', () => {
        beforeEach(async () => {
          await jobProfileDetails.actionMenu.click();
        });

        it('has "Run" option', () => {
          expect(jobProfileDetails.actionMenu.runProfile.isPresent).to.be.true;
        });

        describe('run confirmation modal', () => {
          describe('appears', () => {
            beforeEach(async () => {
              await jobProfileDetails.actionMenu.click();
              await jobProfileDetails.actionMenu.runProfile.click();
            });

            it('upon click on pane header menu run button', () => {
              expect(jobProfileDetails.runConfirmationModal.isPresent).to.be.true;
            });
          });

          describe('disappears', () => {
            beforeEach(async () => {
              await jobProfileDetails.actionMenu.click();
              await jobProfileDetails.actionMenu.runProfile.click();
              await jobProfileDetails.runConfirmationModal.cancelButton.click();
            });

            it('when cancel button is clicked', () => {
              expect(jobProfileDetails.runConfirmationModal.isPresent).to.be.false;
            });
          });
        });
      });
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
            new File([], 'TAMU-Gen.MRC'),
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
        await uploadingJobsDisplay.actionMenu.click();
        await uploadingJobsDisplay.actionMenu.loadRecordsButton.click();
      });

      it('navigates to landing page', () => {
        expect(location().pathname).to.be.equal('/data-import');
      });

      it.always('error callout does not appear', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.false;
      });
    });

    describe('when load records button is clicked twice and the API response is successful', () => {
      beforeEach(async () => {
        await uploadingJobsDisplay.actionMenu.click();
        await uploadingJobsDisplay.actionMenu.loadRecordsButton.click();
        await uploadingJobsDisplay.actionMenu.loadRecordsButton.click();
      });

      it.always('app works correctly and error callout does not appear', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.false;
      });
    });

    describe('when run button is clicked and the API response is successful', () => {
      beforeEach(async () => {
        await jobProfiles.list.rows(0).click();
        await jobProfileDetails.actionMenu.click();
        await jobProfileDetails.actionMenu.runProfile.click();
        await jobProfileDetails.runConfirmationModal.confirmButton.click();
      });

      it('navigates to landing page', () => {
        expect(location().pathname).to.be.equal('/data-import');
      });
    });

    describe('when load records button is clicked and the API response is not successful', () => {
      beforeEach(async function () {
        this.server.get('/data-import/uploadDefinitions/:id', {}, 500);
        this.server.get('/data-import-profiles/jobProfiles/:id', {}, 500);
        await uploadingJobsDisplay.actionMenu.click();
        await uploadingJobsDisplay.actionMenu.loadRecordsButton.click();
      });

      it('error callout appears', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('when load records button is clicked and the API response is not successful', () => {
      beforeEach(async function () {
        this.server.post('/data-import/uploadDefinitions/:id/processFiles', {}, 500);
        await uploadingJobsDisplay.actionMenu.click();
        await uploadingJobsDisplay.actionMenu.loadRecordsButton.click();
      });

      it('error callout appears', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('when run button is clicked and the API response is not successful', () => {
      beforeEach(async function () {
        this.server.get('/data-import/uploadDefinitions/:id', {}, 500);
        await jobProfiles.list.rows(0).click();
        await jobProfileDetails.actionMenu.click();
        await jobProfileDetails.actionMenu.runProfile.click();
        await jobProfileDetails.runConfirmationModal.confirmButton.click();
      });

      it('confirmation modal disappears', () => {
        expect(jobProfileDetails.runConfirmationModal.isPresent).to.be.false;
      });

      it('error callout appears', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('when run button is clicked and the API response is not successful', () => {
      beforeEach(async function () {
        this.server.post('/data-import/uploadDefinitions/:id/processFiles', {}, 500);
        await jobProfiles.list.rows(0).click();
        await jobProfileDetails.actionMenu.click();
        await jobProfileDetails.actionMenu.runProfile.click();
        await jobProfileDetails.runConfirmationModal.confirmButton.click();
      });

      it('confirmation modal disappears', () => {
        expect(jobProfileDetails.runConfirmationModal.isPresent).to.be.false;
      });

      it('error callout appears', () => {
        expect(uploadingJobsDisplay.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
