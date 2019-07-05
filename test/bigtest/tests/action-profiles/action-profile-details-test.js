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
  setupApplication({ scenarios: ['fetch-action-profiles-success', 'fetch-users', 'fetch-tags'] });

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
    });

    describe('edit match profile form', () => {
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
