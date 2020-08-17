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
} from '../../interactors';

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.post('/data-import-profiles/actionProfiles', () => new Response(status, headers, response));
  await actionProfileForm.nameField.fillAndBlur('Valid name');
  await actionProfileForm.descriptionField.fillAndBlur('Valid description');
  await actionProfileForm.actionField.select.selectAndBlur('Create (all record types)');
  await actionProfileForm.folioRecordTypeField.select.selectAndBlur('Item');
  await actionProfileForm.submitFormButton.click();
}

describe('Action profile form', () => {
  setupApplication({ scenarios: ['fetch-action-profiles-success'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/action-profiles');
      await actionProfiles.actionMenu.click();
      await actionProfiles.actionMenu.newProfileButton.click();
    });

    it('upon click on actions new profile button', () => {
      expect(actionProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(function () {
      this.visit('/settings/data-import/action-profiles?layer=create');
    });

    it('when not filled the submit button is disabled', () => {
      expect(actionProfileForm.submitFormButtonDisabled).to.be.true;
    });

    it('and form fields are empty and not pre-filled', () => {
      expect(actionProfileForm.nameField.val).to.be.equal('');
      expect(actionProfileForm.descriptionField.val).to.be.equal('');
      expect(actionProfileForm.actionField.select.val).to.be.equal('');
      expect(actionProfileForm.folioRecordTypeField.select.val).to.be.equal('');
    });

    it('have an associated mapping profile accordion', () => {
      expect(actionProfileForm.associatedMappingProfileAccordion.isPresent).to.be.true;
    });

    describe('when filled correctly', () => {
      beforeEach(async () => {
        await actionProfileForm.nameField.fillAndBlur('Valid name');
        await actionProfileForm.descriptionField.fillAndBlur('Valid description');
      });

      it('the submit button is not disabled', () => {
        expect(actionProfileForm.submitFormButtonDisabled).to.be.false;
      });
    });

    describe('when action field is selected', () => {
      describe('with value "Create"', () => {
        beforeEach(async () => {
          await actionProfileForm.actionField.select.selectAndBlur('Create (all record types)');
        });

        it('the FOLIO record type field has all records', () => {
          expect(actionProfileForm.folioRecordTypeField.options().length).to.be.equal(9);
        });
      });

      describe('with value "Modify"', () => {
        beforeEach(async () => {
          await actionProfileForm.actionField.select.selectAndBlur('Modify (MARC record types only)');
        });

        it('the FOLIO record type field has only MARC records', () => {
          expect(actionProfileForm.folioRecordTypeField.options().length).to.be.equal(4);
        });
      });
    });

    describe('when FOLIO record type field is selected', () => {
      describe('with value "Order"', () => {
        beforeEach(async () => {
          await actionProfileForm.folioRecordTypeField.select.selectAndBlur('Order');
        });

        it('the action field has only option "Create"', () => {
          expect(actionProfileForm.actionField.options().length).to.be.equal(2);
          expect(actionProfileForm.actionField.options(1).text).to.be.equal('Create (all record types)');
        });
      });

      describe('with value "Item"', () => {
        beforeEach(async () => {
          await actionProfileForm.folioRecordTypeField.select.selectAndBlur('Item');
        });

        it('the action field has options "Create" and "Update"', () => {
          expect(actionProfileForm.actionField.options().length).to.be.equal(3);
          expect(actionProfileForm.actionField.options(1).text).to.be.equal('Create (all record types)');
          expect(actionProfileForm.actionField.options(2).text).to.be.equal('Update (all record types except Orders)');
        });
      });
    });
  });
});

describe('When action profile form', () => {
  setupApplication();

  beforeEach(async function () {
    this.visit('/settings/data-import/action-profiles?layer=create');
  });

  describe('is submitted and the response contains', () => {
    describe('error message', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
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
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(actionProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
