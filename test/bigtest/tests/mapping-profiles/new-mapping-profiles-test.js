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
} from '../../interactors';

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.post('/data-import-profiles/mappingProfiles', () => new Response(status, headers, response));
  await mappingProfileForm.nameField.fillAndBlur('Valid name');
  await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
  await mappingProfileForm.folioRecordTypeField.selectAndBlur('Order');
  await mappingProfileForm.descriptionField.fillAndBlur('Valid description');
  await mappingProfileForm.submitFormButton.click();
}

describe('Mapping profile form', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/mapping-profiles');
      await mappingProfiles.newMappingProfileButton.click();
    });

    it('upon click on new mapping profile button', () => {
      expect(mappingProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(function () {
      this.visit('/settings/data-import/mapping-profiles?layer=create');
    });

    it('when not filled when the submit button is disabled', () => {
      expect(mappingProfileForm.submitFormButtonDisabled).to.be.true;
    });

    describe('when filled correctly', () => {
      beforeEach(async () => {
        await mappingProfileForm.nameField.fillAndBlur('Valid name');
        await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
        await mappingProfileForm.folioRecordTypeField.selectAndBlur('Order');
        await mappingProfileForm.descriptionField.fillAndBlur('Valid description');
      });

      it('the submit button is not disabled', () => {
        expect(mappingProfileForm.submitFormButtonDisabled).to.be.false;
      });
    });
  });
});

describe('When mapping profile form', () => {
  setupApplication();

  beforeEach(async function () {
    this.visit('/settings/data-import/mapping-profiles?layer=create');
  });

  describe('is submitted and the response contains', () => {
    describe('error message', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
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
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
