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

describe('Job profiles table', () => {
  setupApplication({ scenarios: ['fetch-job-profiles-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/job-profiles');
  });

  describe('opens file extension details', () => {
    beforeEach(async () => {
      await jobProfiles.list.rows(0).click();
    });

    it('upon click on row', () => {
      expect(jobProfileDetails.isPresent).to.be.true;
    });

    it('jobs using this profile table has correct amount of items', () => {
      expect(jobProfileDetails.jobsUsingThisProfile.rowCount).to.be.equal(3);
    });

    describe('paneHeaderDropdown button', () => {
      beforeEach(async () => {
        await jobProfileDetails.expandPaneHeaderDropdown();
      });

      it('when pane dropdown is opened', () => {
        expect(jobProfileDetails.dropdownEditButton.isVisible).to.be.true;
        expect(jobProfileDetails.dropdownDuplicateButton.isVisible).to.be.true;
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
  });
});

