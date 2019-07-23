import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
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
  });

  describe('associated action profiles', () => {
    describe('when there is associated profile', () => {
      beforeEach(async function () {
        await mappingProfiles.list.rows(0).click();
      });

      it('renders mapping profile', () => {
        expect(mappingProfileDetails.associatedActionProfiles.rowCount).to.be.equal(2);
      });
    });

    describe('when there is no associated profile', () => {
      beforeEach(async function () {
        this.server.get('/data-import-profiles/profileAssociations/:id/masters', noAssociatedActionProfiles);
        await mappingProfiles.list.rows(0).click();
      });

      it('renders empty message', () => {
        expect(mappingProfileDetails.associatedActionProfiles.displaysEmptyMessage).to.be.true;
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
        expect(mappingProfileForm.descriptionField.val).to.be.equal('Description 0');
      });

      it('does not have Incoming record type and FOLIO record type fields', () => {
        expect(mappingProfileForm.incomingRecordTypeField.isPresent).to.be.false;
        expect(mappingProfileForm.folioRecordTypeField.isPresent).to.be.false;
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
        await mappingProfileForm.descriptionField.fillAndBlur('Changed description');
        await mappingProfileForm.submitFormButton.click();
      });

      it('then mapping profile details renders updated mapping profile', () => {
        expect(mappingProfileDetails.headline.text).to.equal('Changed name');
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
});
