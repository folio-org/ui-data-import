import { expect } from 'chai';
import { Response } from '@bigtest/mirage';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import {
  jobProfileForm,
  jobProfileDetails,
  jobProfiles,
} from '../interactors';

async function setupFormSubmitErrorScenario(method, server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  const url = `/data-import-profiles/jobProfiles${
    method === 'put'
      ? '/:id'
      : ''
  }`;

  server[method](url, () => new Response(status, headers, response));
  await jobProfileForm.nameFiled.fillAndBlur('Changed title');
  await jobProfileForm.dataTypeField.selectAndBlur('MARC');
  await jobProfileForm.submitFormButton.click();
}

describe('Job Profile View', () => {
  setupApplication({ scenarios: ['fetch-job-profiles-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/job-profiles');
  });

  describe('opens Job Profile details', () => {
    beforeEach(async () => {
      await jobProfiles.list.rows(0).click();
    });

    it('upon click on row', () => {
      expect(jobProfileDetails.isPresent).to.be.true;
    });

    it('jobs using this profile table has correct amount of items', () => {
      expect(jobProfileDetails.jobsUsingThisProfile.rowCount).to.be.equal(3);
    });

    describe('edit job profile form', () => {
      describe('appears', () => {
        beforeEach(async () => {
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownEditButton.click();
        });

        it('upon click on pane header menu edit button', () => {
          expect(jobProfileForm.isPresent).to.be.true;
        });
      });

      describe('appears', () => {
        beforeEach(async () => {
          await jobProfileDetails.editButton.click();
        });

        it('upon click on edit button', () => {
          expect(jobProfileForm.isPresent).to.be.true;
        });
      });
    });

    describe('edit job profile form', () => {
      beforeEach(async () => {
        await jobProfileDetails.editButton.click();
      });

      describe('when form is submitted', () => {
        beforeEach(async () => {
          await jobProfileForm.nameFiled.fillAndBlur('Changed name');
          await jobProfileForm.dataTypeField.selectAndBlur('MARC');
          await jobProfileForm.descriptionField.fillAndBlur('Changed description');
          await jobProfileForm.submitFormButton.click();
        });

        it('then job profile details renders updated job profile', () => {
          expect(jobProfileDetails.headline.text).to.equal('Changed name');
          expect(jobProfileDetails.acceptedDataType.text).to.equal('MARC');
          expect(jobProfileDetails.description.text).to.equal('Changed description');
        });
      });

      describe('is submitted and the response contains', () => {
        describe('error message', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server, {
              response: {
                errors: [{ message: 'jobProfile.duplication.invalid' }],
              },
              status: 422,
            });
          });

          it('then error callout appears', () => {
            expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });

        describe('network error', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server);
          });

          it('then error callout appears', () => {
            expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });
      });
    });

    describe('duplicate job profile form', () => {
      describe('appears', () => {
        beforeEach(async () => {
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownDuplicateButton.click();
        });

        it('upon click on pane header menu duplicate button', () => {
          expect(jobProfileForm.isPresent).to.be.true;
        });
      });

      describe('appears', () => {
        beforeEach(async () => {
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownDuplicateButton.click();
        });

        describe('when form is submitted', () => {
          beforeEach(async () => {
            await jobProfileForm.nameFiled.fillAndBlur('My new name');
            await jobProfileForm.dataTypeField.selectAndBlur('MARC');
            await jobProfileForm.descriptionField.fillAndBlur('My new description');
            await jobProfileForm.submitFormButton.click();
          });

          it('then job profile details renders duplicated job profile', () => {
            expect(jobProfileDetails.headline.text).to.equal('My new name');
            expect(jobProfileDetails.acceptedDataType.text).to.equal('MARC');
            expect(jobProfileDetails.description.text).to.equal('My new description');
          });
        });

        describe('when form is submitted and the response contains', () => {
          describe('error message', () => {
            beforeEach(async function () {
              await setupFormSubmitErrorScenario('post', this.server, {
                response: {
                  errors: [{ message: 'jobProfile.duplication.invalid' }],
                },
                status: 422,
              });
            });

            it('then error callout appears', () => {
              expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
            });
          });

          describe('network error', () => {
            beforeEach(async function () {
              await setupFormSubmitErrorScenario('post', this.server);
            });

            it('then error callout appears', () => {
              expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
            });
          });

          describe('unparsed data', () => {
            beforeEach(async function () {
              await setupFormSubmitErrorScenario('post', this.server, {
                response: '',
                status: 422,
              });
            });

            it('then error callout appears', () => {
              expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
            });
          });

          describe('error without body', () => {
            beforeEach(async function () {
              await setupFormSubmitErrorScenario('post', this.server, {
                response: null,
                status: 422,
              });
            });

            it('then error callout appears', () => {
              expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
            });
          });
        });
      });
    });

    describe('delete confirmation modal', () => {
      it('is not visible when pane header dropdown is closed', () => {
        expect(jobProfileDetails.confirmationModal.isPresent).to.be.false;
      });

      describe('is visible', () => {
        beforeEach(async () => {
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownDeleteButton.click();
        });

        it('when pane header dropdown is opened', () => {
          expect(jobProfileDetails.confirmationModal.isPresent).to.be.true;
        });
      });

      describe('disappears', () => {
        beforeEach(async () => {
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownDeleteButton.click();
          await jobProfileDetails.confirmationModal.cancelButton.click();
        });

        it('when cancel button is clicked', () => {
          expect(jobProfileDetails.confirmationModal.isPresent).to.be.false;
        });
      });

      describe('upon click on confirm button initiates the job profile deletion process and in case of success', () => {
        beforeEach(async () => {
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownDeleteButton.click();
          await jobProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(jobProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        it('the successful toast appears', () => {
          expect(jobProfileDetails.callout.successCalloutIsPresent).to.be.true;
        });
      });

      describe('upon click on confirm button twice initiates the job profile deletion process only once and in case of success', () => {
        beforeEach(async () => {
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownDeleteButton.click();
          await jobProfileDetails.confirmationModal.confirmButton.click();
          await jobProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(jobProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        it('the successful toast appears', () => {
          expect(jobProfileDetails.callout.successCalloutIsPresent).to.be.true;
        });

        it('renders the correct number of rows without deleted one', () => {
          expect(jobProfiles.list.rowCount).to.equal(2);
        });
      });

      describe('upon click on confirm button twice initiates the job profile deletion process only once and in case of error', () => {
        beforeEach(async function () {
          this.server.delete('/data-import-profiles/jobProfiles/:id', () => new Response(500, {}));
          await jobProfileDetails.expandPaneHeaderDropdown();
          await jobProfileDetails.dropdownDeleteButton.click();
          await jobProfileDetails.confirmationModal.confirmButton.click();
          await jobProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(jobProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        it('the error toast appears', () => {
          expect(jobProfileDetails.callout.errorCalloutIsPresent).to.be.true;
        });

        it('renders the correct number including the one which tried to delete', () => {
          expect(jobProfiles.list.rowCount).to.equal(3);
        });
      });
    });
  });
});

