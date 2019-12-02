import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
  actionProfileDetails,
  mappingProfiles,
  mappingProfileForm,
  mappingProfileDetails,
} from '../../interactors';
import { noAssociatedActionProfiles } from '../../mocks';

async function setupFormSubmitErrorScenario(method, server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  const url = `/data-import-profiles/mappingProfiles${method === 'put' ? '/:id' : ''}`;

  server[method](url, () => new Response(status, headers, response));
  await mappingProfileForm.nameField.fillAndBlur('Changed title');
  await mappingProfileForm.submitFormButton.click();
}

describe('Mapping Profile View', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  beforeEach(function () {
    this.visit('/settings/data-import/mapping-profiles');
  });

  describe('details pane', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
    });

    it('has correct name', () => {
      expect(mappingProfileDetails.headline.text).to.be.equal('Name 0');
    });

    it('has correct incoming record type', () => {
      expect(mappingProfileDetails.incomingRecordType.text).to.be.equal('MARC Bibliographic');
    });

    it('has correct FOLIO record type', () => {
      expect(mappingProfileDetails.folioRecordType.text).to.be.equal('Instance');
    });

    it('has correct description', () => {
      expect(mappingProfileDetails.description.text).to.be.equal('Description 0');
    });

    it('display tags accordion', () => {
      expect(mappingProfileDetails.isTagsPresent).to.be.true;
    });

    describe('associated action profile', () => {
      it('has correct count of items', () => {
        expect(mappingProfileDetails.associatedActionProfiles.list.rowCount).to.be.equal(2);
      });

      describe('when action profile is clicked', () => {
        beforeEach(async function () {
          this.server.get('/data-import-profiles/profileAssociations/:id/masters', {});
          await mappingProfileDetails.associatedActionProfiles.actionProfilesLinks(0).click();
        });

        it('redirects to action profile details', () => {
          expect(actionProfileDetails.isPresent).to.be.true;
        });
      });
    });
  });

  describe('associated action profiles', () => {
    describe('when there is associated profile', () => {
      beforeEach(async function () {
        await mappingProfiles.list.rows(0).click();
      });

      it('renders mapping profile', () => {
        expect(mappingProfileDetails.associatedActionProfiles.list.rowCount).to.be.equal(2);
      });
    });

    describe('when there is no associated profile', () => {
      beforeEach(async function () {
        this.server.get('/data-import-profiles/profileAssociations/:id/masters', noAssociatedActionProfiles);
        await mappingProfiles.list.rows(0).click();
      });

      it('renders empty message', () => {
        expect(mappingProfileDetails.associatedActionProfiles.list.displaysEmptyMessage).to.be.true;
      });
    });
  });

  describe('edit mapping profile form', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
    });

    describe('appears', () => {
      beforeEach(async () => {
        await mappingProfileDetails.expandPaneHeaderDropdown();
        await mappingProfileDetails.dropdownEditButton.click();
      });

      it('upon click on pane header menu edit button', () => {
        expect(mappingProfileForm.isPresent).to.be.true;
      });
    });

    describe('appears', () => {
      beforeEach(async () => {
        await mappingProfileDetails.editButton.click();
      });

      it('and form fields are pre-filled with current data', () => {
        expect(mappingProfileForm.nameField.val).to.be.equal('Name 0');
        expect(mappingProfileForm.incomingRecordTypeField.val).to.be.equal('MARC_BIBLIOGRAPHIC');
        expect(mappingProfileForm.folioRecordTypeField.val).to.be.equal('INSTANCE');
        expect(mappingProfileForm.descriptionField.val).to.be.equal('Description 0');
      });

      it('and does not have associated action profiles accordion', () => {
        expect(mappingProfileForm.associatedActionProfilesAccordion.isPresent).to.be.false;
      });
    });
  });

  describe('edit mapping profile form', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
      await mappingProfileDetails.editButton.click();
    });

    describe('when form is submitted', () => {
      beforeEach(async () => {
        await mappingProfileForm.nameField.fillAndBlur('Changed name');
        await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Holdings');
        await mappingProfileForm.folioRecordTypeField.selectAndBlur('Invoice');
        await mappingProfileForm.descriptionField.fillAndBlur('Changed description');
        await mappingProfileForm.submitFormButton.click();
      });

      it('then mapping profile details renders updated mapping profile', () => {
        expect(mappingProfileDetails.headline.text).to.equal('Changed name');
        expect(mappingProfileDetails.incomingRecordType.text).to.equal('MARC Holdings');
        expect(mappingProfileDetails.folioRecordType.text).to.equal('Invoice');
        expect(mappingProfileDetails.description.text).to.equal('Changed description');
      });
    });

    describe('is submitted and the response contains', () => {
      describe('error message', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('put', this.server, {
            response: { errors: [{ message: 'mappingProfile.duplication.invalid' }] },
            status: 422,
          });
        });

        it('then error callout appears', () => {
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });

      describe('network error', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('put', this.server);
        });

        it('then error callout appears', () => {
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });
    });
  });

  describe('duplicate mapping profile form', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
      await mappingProfileDetails.expandPaneHeaderDropdown();
      await mappingProfileDetails.dropdownDuplicateButton.click();
    });

    it('appears upon click on pane header menu duplicate button', () => {
      expect(mappingProfileForm.isPresent).to.be.true;
    });

    describe('when form is submitted', () => {
      beforeEach(async () => {
        await mappingProfileForm.nameField.fillAndBlur('Valid name');
        await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
        await mappingProfileForm.folioRecordTypeField.selectAndBlur('Order');
        await mappingProfileForm.descriptionField.fillAndBlur('Valid description');
        await mappingProfileForm.submitFormButton.click();
      });

      it('then mapping profile details renders duplicated mapping profile', () => {
        expect(mappingProfileDetails.headline.text).to.equal('Valid name');
        expect(mappingProfileDetails.incomingRecordType.text).to.equal('MARC Bibliographic');
        expect(mappingProfileDetails.folioRecordType.text).to.equal('Order');
        expect(mappingProfileDetails.description.text).to.equal('Valid description');
      });
    });

    describe('when form is submitted and the response contains', () => {
      describe('error message', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('post', this.server, {
            response: { errors: [{ message: 'mappingProfile.duplication.invalid' }] },
            status: 422,
          });
        });

        it('then error callout appears', () => {
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });

      describe('network error', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('post', this.server);
        });

        it('then error callout appears', () => {
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });
    });
  });

  describe('delete confirmation modal', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
    });

    describe('is visible', () => {
      beforeEach(async () => {
        await mappingProfileDetails.expandPaneHeaderDropdown();
        await mappingProfileDetails.dropdownDeleteButton.click();
      });

      it('when pane header dropdown is opened', () => {
        expect(mappingProfileDetails.isPresent).to.be.true;
      });
    });

    describe('disappears', () => {
      beforeEach(async () => {
        await mappingProfileDetails.expandPaneHeaderDropdown();
        await mappingProfileDetails.dropdownDeleteButton.click();
        await mappingProfileDetails.confirmationModal.cancelButton.click();
      });

      it('when cancel button is clicked', () => {
        expect(mappingProfileDetails.confirmationModal.isPresent).to.be.false;
      });
    });

    describe('upon click on confirm button initiates the mapping profile deletion process and in case of error', () => {
      beforeEach(async function () {
        this.server.delete('/data-import-profiles/mappingProfiles/:id', () => new Response(500, {}));
        await mappingProfileDetails.expandPaneHeaderDropdown();
        await mappingProfileDetails.dropdownDeleteButton.click();
        await mappingProfileDetails.confirmationModal.confirmButton.click();
      });

      it('disappears', () => {
        expect(mappingProfileDetails.confirmationModal.isPresent).to.be.false;
      });

      it('the error toast appears', () => {
        expect(mappingProfileDetails.callout.errorCalloutIsPresent).to.be.true;
      });

      it('renders the correct number including the one which tried to delete', () => {
        expect(mappingProfiles.list.rowCount).to.equal(3);
      });
    });

    describe('upon click on confirm button initiates the job profile deletion process and in case of success', () => {
      describe('exception modal', () => {
        beforeEach(async () => {
          await mappingProfileDetails.expandPaneHeaderDropdown();
          await mappingProfileDetails.dropdownDeleteButton.click();
          await mappingProfileDetails.confirmationModal.confirmButton.click();
          await mappingProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(mappingProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        describe('when there are associated job profiles', () => {
          it('appears', () => {
            expect(mappingProfiles.exceptionModal.isPresent).to.be.true;
          });

          describe('and clicking on close button', () => {
            beforeEach(async () => {
              await mappingProfiles.exceptionModalCloseButton.click();
            });

            it('closes the modal', () => {
              expect(mappingProfiles.exceptionModal.isPresent).to.be.false;
            });

            it('renders the correct number including the one which tried to delete', () => {
              expect(mappingProfiles.list.rowCount).to.equal(3);
            });
          });
        });
      });

      describe('when there are no associated job profiles', () => {
        beforeEach(async function () {
          this.server.delete('/data-import-profiles/mappingProfiles/:id');
          await mappingProfileDetails.expandPaneHeaderDropdown();
          await mappingProfileDetails.dropdownDeleteButton.click();
          await mappingProfileDetails.confirmationModal.confirmButton.click();
        });

        it('does not appear', () => {
          expect(mappingProfiles.exceptionModal.isPresent).to.be.false;
        });

        it('renders the correct number of rows without deleted one', () => {
          expect(mappingProfiles.list.rowCount).to.equal(2);
        });
      });
    });
  });
});

describe('Mapping Profile View', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-disabled'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/mapping-profiles');
    await mappingProfiles.list.rows(0).click();
  });

  it('does not display tags accordion', () => {
    expect(mappingProfileDetails.isTagsPresent).to.be.false;
  });
});
