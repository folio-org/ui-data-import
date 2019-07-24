import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
  actionProfiles,
  actionProfileForm,
  actionProfileDetails,
  jobProfileDetails,
  mappingProfileDetails,
} from '../../interactors';
import {
  associatedMappingProfile,
  noAssociatedMappingProfile,
} from '../../mocks';

async function setupFormSubmitErrorScenario(method, server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  const url = `/data-import-profiles/actionProfiles${method === 'put' ? '/:id' : ''}`;

  server[method](url, () => new Response(status, headers, response));
  await actionProfileForm.nameField.fillAndBlur('Changed title');
  await actionProfileForm.submitFormButton.click();
  if (await actionProfileForm.confirmEditModal.isPresent) {
    await actionProfileForm.confirmEditModal.confirmButton.click();
  }
}

describe('Action Profile View', () => {
  setupApplication({
    scenarios: [
      'fetch-action-profiles-success',
      'fetch-job-profiles-success',
      'fetch-mapping-profiles-success',
      'fetch-users',
      'fetch-tags',
      'tags-enabled',
    ],
  });

  beforeEach(function () {
    this.visit('/settings/data-import/action-profiles');
  });

  describe('associated field mapping profile', () => {
    describe('when there is associated profile', () => {
      beforeEach(async function () {
        this.server.get('/data-import-profiles/profileAssociations/:id/details', associatedMappingProfile);
        await actionProfiles.list.rows(0).click();
      });

      it('renders mapping profile', () => {
        expect(actionProfileDetails.associatedMappingProfile.rowCount).to.be.equal(1);
      });
    });

    describe('when there is no associated profile', () => {
      beforeEach(async function () {
        this.server.get('/data-import-profiles/profileAssociations/:id/details', noAssociatedMappingProfile);
        await actionProfiles.list.rows(0).click();
      });

      it('renders empty message', () => {
        expect(actionProfileDetails.associatedMappingProfile.displaysEmptyMessage).to.be.true;
      });
    });
  });

  describe('details pane', () => {
    beforeEach(async () => {
      await actionProfiles.list.rows(0).click();
    });

    it('has correct name', () => {
      expect(actionProfileDetails.headline.text).to.be.equal('Name 0');
    });

    it('has correct description', () => {
      expect(actionProfileDetails.description.text).to.be.equal('Description 0');
    });

    it('display tags accordion', () => {
      expect(actionProfileDetails.isTagsPresent).to.be.true;
    });

    describe('associated mapping profile', () => {
      it('has only one item', () => {
        expect(actionProfileDetails.associatedMappingProfile.rowCount).to.be.equal(1);
      });

      describe('when mapping profile is clicked', () => {
        beforeEach(async () => {
          await actionProfileDetails.associatedMappingProfile.rows(0).click();
        });

        it('redirects to mapping profile details', () => {
          expect(mappingProfileDetails.isPresent).to.be.true;
        });
      });
    });

    describe('associated job profiles', () => {
      it('has correct amount of items', () => {
        expect(actionProfileDetails.associatedJobProfiles.list.rowCount).to.be.equal(3);
      });

      describe('has select all checkbox', () => {
        beforeEach(async () => {
          await actionProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
        });

        it('upon click changes its state', () => {
          expect(actionProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.true;
        });

        it('selects all items', () => {
          actionProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
            expect(checkBox.isChecked).to.be.true;
          });
        });

        describe('when not all records are selected', () => {
          beforeEach(async () => {
            await actionProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
          });

          it('becomes unchecked', () => {
            expect(actionProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.false;
          });
        });

        describe('when clicked again', () => {
          beforeEach(async () => {
            await actionProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
          });

          it('all items become unchecked', () => {
            actionProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
              expect(checkBox.isChecked).to.be.false;
            });
          });
        });
      });

      describe('has select individual item checkbox', () => {
        beforeEach(async () => {
          await actionProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
        });

        it('upon click changes its state', () => {
          expect(actionProfileDetails.associatedJobProfiles.checkBoxes(0).isChecked).to.be.true;
        });
      });

      describe('when job profile name is clicked', () => {
        beforeEach(async () => {
          await actionProfileDetails.associatedJobProfiles.jobProfilesLinks(0).click();
        });

        it('redirects to job profile details', () => {
          expect(jobProfileDetails.isPresent).to.be.true;
        });
      });
    });

    describe('edit action profile form', () => {
      beforeEach(async () => {
        await actionProfiles.list.rows(0).click();
      });

      describe('appears', () => {
        beforeEach(async () => {
          await actionProfileDetails.expandPaneHeaderDropdown();
          await actionProfileDetails.dropdownEditButton.click();
        });

        it('upon click on pane header menu edit button', () => {
          expect(actionProfileForm.isPresent).to.be.true;
        });
      });

      describe('appears', () => {
        beforeEach(async () => {
          await actionProfileDetails.editButton.click();
        });

        it('and form fields are pre-filled with current data', () => {
          expect(actionProfileForm.nameField.val).to.be.equal('Name 0');
          expect(actionProfileForm.descriptionField.val).to.be.equal('Description 0');
        });

        it('and does not have associated mapping profile accordion', () => {
          expect(actionProfileForm.associatedMappingProfileAccordion.isPresent).to.be.false;
        });

        it('upon click on edit button', () => {
          expect(actionProfileForm.isPresent).to.be.true;
        });
      });
    });

    describe('edit action profile form', () => {
      beforeEach(async () => {
        await actionProfileDetails.editButton.click();
      });

      describe('when form is submitted', () => {
        beforeEach(async () => {
          await actionProfileForm.nameField.fillAndBlur('Changed name');
          await actionProfileForm.descriptionField.fillAndBlur('Changed description');
          await actionProfileForm.submitFormButton.click();
        });

        describe('and there are associated job profiles', () => {
          it('confirmation modal appears', () => {
            expect(actionProfileForm.confirmEditModal.isPresent).to.be.true;
          });

          describe('and "Confirm" button is clicked', () => {
            beforeEach(async () => {
              await actionProfileForm.confirmEditModal.confirmButton.click();
            });

            it('then action profile details renders updated action profile', () => {
              expect(actionProfileDetails.headline.text).to.equal('Changed name');
              expect(actionProfileDetails.description.text).to.equal('Changed description');
            });
          });

          describe('and "Cancel" button is clicked', () => {
            beforeEach(async () => {
              await actionProfileForm.confirmEditModal.cancelButton.click();
            });

            it('closes modal and stay on edit screen', () => {
              expect(actionProfileForm.confirmEditModal.isPresent).to.be.false;
              expect(actionProfileForm.isPresent).to.be.true;
            });
          });
        });
      });

      describe('is submitted and the response contains', () => {
        describe('error message', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server, {
              response: { errors: [{ message: 'actionProfile.duplication.invalid' }] },
              status: 422,
            });
          });

          it('then error callout appears', () => {
            expect(actionProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });

        describe('network error', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server);
          });

          it('then error callout appears', () => {
            expect(actionProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });
      });
    });

    describe('delete confirmation modal', () => {
      it('is not visible when pane header dropdown is closed', () => {
        expect(actionProfileDetails.confirmationModal.isPresent).to.be.false;
      });

      describe('is visible', () => {
        beforeEach(async () => {
          await actionProfileDetails.expandPaneHeaderDropdown();
          await actionProfileDetails.dropdownDeleteButton.click();
        });

        it('when pane header dropdown is opened', () => {
          expect(actionProfileDetails.isPresent).to.be.true;
        });
      });

      describe('disappears', () => {
        beforeEach(async () => {
          await actionProfileDetails.expandPaneHeaderDropdown();
          await actionProfileDetails.dropdownDeleteButton.click();
          await actionProfileDetails.confirmationModal.cancelButton.click();
        });

        it('when cancel button is clicked', () => {
          expect(actionProfileDetails.confirmationModal.isPresent).to.be.false;
        });
      });

      describe('upon click on confirm button initiates the action profile deletion process and in case of error', () => {
        beforeEach(async function () {
          this.server.delete('/data-import-profiles/actionProfiles/:id', () => new Response(500, {}));
          await actionProfileDetails.expandPaneHeaderDropdown();
          await actionProfileDetails.dropdownDeleteButton.click();
          await actionProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(actionProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        it('the error toast appears', () => {
          expect(actionProfileDetails.callout.errorCalloutIsPresent).to.be.true;
        });

        it('renders the correct number including the one which tried to delete', () => {
          expect(actionProfiles.list.rowCount).to.equal(8);
        });
      });

      describe('upon click on confirm button initiates the job profile deletion process and in case of success', () => {
        describe('exception modal', () => {
          beforeEach(async () => {
            await actionProfileDetails.expandPaneHeaderDropdown();
            await actionProfileDetails.dropdownDeleteButton.click();
            await actionProfileDetails.confirmationModal.confirmButton.click();
            await actionProfileDetails.confirmationModal.confirmButton.click();
          });

          it('disappears', () => {
            expect(actionProfileDetails.confirmationModal.isPresent).to.be.false;
          });

          describe('when there are associated job profiles', () => {
            it('appears', () => {
              expect(actionProfiles.exceptionModal.isPresent).to.be.true;
            });

            describe('and clicking on close button', () => {
              beforeEach(async () => {
                await actionProfiles.exceptionModalCloseButton.click();
              });

              it('closes the modal', () => {
                expect(actionProfiles.exceptionModal.isPresent).to.be.false;
              });

              it('renders the correct number including the one which tried to delete', () => {
                expect(actionProfiles.list.rowCount).to.equal(8);
              });
            });
          });
        });

        describe('when there are no associated job profiles', () => {
          beforeEach(async function () {
            this.server.delete('/data-import-profiles/actionProfiles/:id');
            await actionProfileDetails.expandPaneHeaderDropdown();
            await actionProfileDetails.dropdownDeleteButton.click();
            await actionProfileDetails.confirmationModal.confirmButton.click();
          });

          it('does not appear', () => {
            expect(actionProfiles.exceptionModal.isPresent).to.be.false;
          });

          it('renders the correct number of rows without deleted one', () => {
            expect(actionProfiles.list.rowCount).to.equal(7);
          });
        });
      });
    });

    describe('duplicate action profile form', () => {
      beforeEach(async () => {
        await actionProfileDetails.expandPaneHeaderDropdown();
        await actionProfileDetails.dropdownDuplicateButton.click();
      });

      it('appears upon click on pane header menu duplicate button', () => {
        expect(actionProfileForm.isPresent).to.be.true;
      });

      describe('when form is submitted', () => {
        beforeEach(async () => {
          await actionProfileForm.nameField.fillAndBlur('Changed name');
          await actionProfileForm.descriptionField.fillAndBlur('Changed description');
          await actionProfileForm.submitFormButton.click();
        });

        it('then action profile details renders duplicated action profile', () => {
          expect(actionProfileDetails.headline.text).to.equal('Changed name');
          expect(actionProfileDetails.description.text).to.equal('Changed description');
        });
      });

      describe('when form is submitted and the response contains', () => {
        describe('error message', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('post', this.server, {
              response: { errors: [{ message: 'actionProfile.duplication.invalid' }] },
              status: 422,
            });
          });

          it('then error callout appears', () => {
            expect(actionProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });

        describe('network error', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('post', this.server);
          });

          it('then error callout appears', () => {
            expect(actionProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
            expect(actionProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
            expect(actionProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });
      });
    });
  });

  describe('when action profile is edited and there is no associated job profiles', () => {
    setupApplication({ scenarios: ['fetch-action-profiles-success', 'fetch-users'] });

    beforeEach(async function () {
      this.server.get('/data-import-profiles/profileAssociations/:id/masters', {});
      this.visit('/settings/data-import/action-profiles');
      await actionProfiles.list.rows(0).click();
      await actionProfileDetails.editButton.click();
      await actionProfileForm.nameField.fillAndBlur('Changed name');
      await actionProfileForm.descriptionField.fillAndBlur('Changed description');
      await actionProfileForm.submitFormButton.click();
    });

    it('confirmation modal does not appear', () => {
      expect(actionProfileForm.confirmEditModal.isPresent).to.be.false;
    });

    it('and action profile details renders updated action profile', () => {
      expect(actionProfileDetails.headline.text).to.equal('Changed name');
      expect(actionProfileDetails.description.text).to.equal('Changed description');
    });
  });
});

describe('Action Profile View', () => {
  setupApplication({ scenarios: ['fetch-action-profiles-success', 'fetch-users', 'fetch-tags', 'tags-disabled'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/action-profiles');
    await actionProfiles.list.rows(0).click();
  });

  it('does not display tags accordion', () => {
    expect(actionProfileDetails.isTagsPresent).to.be.false;
  });
});
