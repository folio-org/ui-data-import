import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { location } from '@bigtest/react';

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

    it('renders', () => {
      expect(uploadingJobsDisplay.isPresent).to.be.true;
    });

    it('renders the correct number of files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(4);
    });

    describe('File item', () => {
      describe('with status NEW', () => {
        const fileItem = uploadingJobsDisplay.files(0);

        it('renders', () => {
          expect(fileItem.isPresent).to.be.true;
        });

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

        it('renders', () => {
          expect(fileItem.isPresent).to.be.true;
        });

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

        it('renders', () => {
          expect(fileItem.isPresent).to.be.true;
        });

        it('has no progress', () => {
          expect(fileItem.progress.isPresent).to.be.false;
        });

        it('has delete button', () => {
          expect(fileItem.deleteButton.isPresent).to.be.true;
        });
      });

      describe('with status ERROR', () => {
        const fileItem = uploadingJobsDisplay.files(3);

        it('renders', () => {
          expect(fileItem.isPresent).to.be.true;
        });

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

        it('renders', () => {
          expect(fileItem.isPresent).to.be.true;
        });

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

    beforeEach(async function () {
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

    describe('empty message', () => {
      it('renders', () => {
        expect(uploadingJobsDisplay.emptyMsg.isPresent).to.be.true;
      });

      it('is correct', () => {
        expect(uploadingJobsDisplay.emptyMsg.text).to.equal(translation.noUploadedFiles);
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
          files: [new File([], 'TAMU-Gen_55.mrc'), new File([], 'TAMU-Gen.mrc')],
        },
      });
    });

    it('renders files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(2);
    });

    describe('when navigating away inside application', () => {
      describe('and there are files uploading in progress', () => {
        beforeEach(async () => {
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

  describe('when unable to create upload definition', () => {
    setupApplication({ scenarios: ['create-upload-definition-error'] });

    beforeEach(async function () {
      this.visit('/data-import');
      await importJobs.triggerDrop({
        dataTransfer: {
          types: ['Files'],
          files: [new File([], 'TAMU-Gen_55.mrc'), new File([], 'TAMU-Gen.mrc')],
        },
      });
    });

    it('renders files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(2);
    });

    it('files are rendered with error message', () => {
      const fileItems = uploadingJobsDisplay.files();

      fileItems.forEach(fileItem => {
        expect(fileItem.hasDangerClass).to.be.true;
        expect(fileItem.hasFailedClass).to.be.true;
        expect(fileItem.errorMsg).to.equal(translation['upload.invalid']);
      });
    });
  });

  describe('when there is not enough space to create upload definition on the server', () => {
    setupApplication({ scenarios: ['create-upload-definition-not-enough-memory-error'] });

    beforeEach(function () {
      this.visit({
        pathname: '/data-import/job-profile',
        state: { files: [new File([], 'TAMU-Gen_55.mrc'), new File([], 'TAMU-Gen.mrc')] },
      });
    });

    it('renders files', () => {
      expect(uploadingJobsDisplay.files().length).to.equal(2);
    });

    it('files are rendered with error message', () => {
      const fileItems = uploadingJobsDisplay.files();

      fileItems.forEach(fileItem => {
        expect(fileItem.hasDangerClass).to.be.true;
        expect(fileItem.hasFailedClass).to.be.true;
        expect(fileItem.errorMsg).to.equal(translation['upload.fileSize.invalid']);
      });
    });
  });
});
