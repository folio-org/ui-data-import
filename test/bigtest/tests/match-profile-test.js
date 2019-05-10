import { expect } from 'chai';
import { Response } from '@bigtest/mirage';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import {
  matchProfileForm,
  matchProfileDetails,
  matchProfiles,
} from '../interactors';

async function setupFormSubmitErrorScenario(method, server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  const url = `/data-import-profiles/matchProfiles${
    method === 'put'
      ? '/:id'
      : ''
  }`;

  server[method](url, () => new Response(status, headers, response));
  await matchProfileForm.nameFiled.fillAndBlur('Changed title');
  await matchProfileForm.matchField.selectAndBlur('Field');
  await matchProfileForm.submitFormButton.click();
}

describe('Match Profile View', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-users'] });

  beforeEach(function () {
    this.visit('/settings/data-import/match-profiles');
  });

  describe('opens Match Profile details', () => {
    beforeEach(async () => {
      await matchProfiles.list.rows(0).click();
    });

    it('upon click on row', () => {
      expect(matchProfileDetails.isPresent).to.be.true;
    });

    it('jobs using this profile table has correct amount of items', () => {
      expect(matchProfileDetails.jobsUsingThisProfile.rowCount).to.be.equal(3);
    });

    describe('edit match profile form', () => {
      describe('appears', () => {
        beforeEach(async () => {
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownEditButton.click();
        });

        it('upon click on pane header menu edit button', () => {
          expect(matchProfileForm.isPresent).to.be.true;
        });
      });

      describe('appears', () => {
        beforeEach(async () => {
          await matchProfileDetails.editButton.click();
        });

        it('upon click on edit button', () => {
          expect(matchProfileForm.isPresent).to.be.true;
        });
      });
    });

    describe('edit match profile form', () => {
      beforeEach(async () => {
        await matchProfileDetails.editButton.click();
      });

      describe('when form is submitted', () => {
        beforeEach(async () => {
          await matchProfileForm.nameFiled.fillAndBlur('Changed name');
          await matchProfileForm.matchField.selectAndBlur('Match');
          await matchProfileForm.descriptionField.fillAndBlur('Changed description');
          await matchProfileForm.submitFormButton.click();
        });

        it('then match profile details renders updated match profile', () => {
          expect(matchProfileDetails.headline.text).to.equal('Changed name');
          expect(matchProfileDetails.acceptedMatch.text).to.equal('Field');
          expect(matchProfileDetails.description.text).to.equal('Changed description');
        });
      });

      describe('is submitted and the response contains', () => {
        describe('error message', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server, {
              response: {
                errors: [{ message: 'matchProfile.duplication.invalid' }],
              },
              status: 422,
            });
          });

          it('then error callout appears', () => {
            expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });

        describe('network error', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server);
          });

          it('then error callout appears', () => {
            expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });
      });
    });

    describe('duplicate match profile form', () => {
      describe('appears', () => {
        beforeEach(async () => {
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownDuplicateButton.click();
        });

        it('upon click on pane header menu duplicate button', () => {
          expect(matchProfileForm.isPresent).to.be.true;
        });
      });

      describe('appears', () => {
        beforeEach(async () => {
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownDuplicateButton.click();
        });

        describe('when form is submitted', () => {
          beforeEach(async () => {
            await matchProfileForm.nameFiled.fillAndBlur('My new name');
            await matchProfileForm.matchField.selectAndBlur('Field');
            await matchProfileForm.descriptionField.fillAndBlur('My new description');
            await matchProfileForm.submitFormButton.click();
          });

          it('then match profile details renders duplicated match profile', () => {
            expect(matchProfileDetails.headline.text).to.equal('My new name');
            expect(matchProfileDetails.acceptedMatch.text).to.equal('Field');
            expect(matchProfileDetails.description.text).to.equal('My new description');
          });
        });

        describe('when form is submitted and the response contains', () => {
          describe('error message', () => {
            beforeEach(async function () {
              await setupFormSubmitErrorScenario('post', this.server, {
                response: {
                  errors: [{ message: 'matchProfile.duplication.invalid' }],
                },
                status: 422,
              });
            });

            it('then error callout appears', () => {
              expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
            });
          });

          describe('network error', () => {
            beforeEach(async function () {
              await setupFormSubmitErrorScenario('post', this.server);
            });

            it('then error callout appears', () => {
              expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
              expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
              expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
            });
          });
        });
      });
    });

    describe('delete confirmation modal', () => {
      it('is not visible when pane header dropdown is closed', () => {
        expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
      });

      describe('is visible', () => {
        beforeEach(async () => {
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownDeleteButton.click();
        });

        it('when pane header dropdown is opened', () => {
          expect(matchProfileDetails.confirmationModal.isPresent).to.be.true;
        });
      });

      describe('disappears', () => {
        beforeEach(async () => {
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownDeleteButton.click();
          await matchProfileDetails.confirmationModal.cancelButton.click();
        });

        it('when cancel button is clicked', () => {
          expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
        });
      });

      describe('upon click on confirm button initiates the match profile deletion process and in case of success', () => {
        beforeEach(async () => {
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownDeleteButton.click();
          await matchProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        it('the successful toast appears', () => {
          expect(matchProfileDetails.callout.successCalloutIsPresent).to.be.true;
        });
      });

      describe('upon click on confirm button twice initiates the match profile deletion process only once and in case of success', () => {
        beforeEach(async () => {
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownDeleteButton.click();
          await matchProfileDetails.confirmationModal.confirmButton.click();
          await matchProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        it('the successful toast appears', () => {
          expect(matchProfileDetails.callout.successCalloutIsPresent).to.be.true;
        });

        it('renders the correct number of rows without deleted one', () => {
          expect(matchProfiles.list.rowCount).to.equal(2);
        });
      });

      describe('upon click on confirm button twice initiates the match profile deletion process only once and in case of error', () => {
        beforeEach(async function () {
          this.server.delete('/data-import-profiles/matchProfiles/:id', () => new Response(500, {}));
          await matchProfileDetails.expandPaneHeaderDropdown();
          await matchProfileDetails.dropdownDeleteButton.click();
          await matchProfileDetails.confirmationModal.confirmButton.click();
          await matchProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        it('the error toast appears', () => {
          expect(matchProfileDetails.callout.errorCalloutIsPresent).to.be.true;
        });

        it('renders the correct number including the one which tried to delete', () => {
          expect(matchProfiles.list.rowCount).to.equal(3);
        });
      });
    });
  });
});

