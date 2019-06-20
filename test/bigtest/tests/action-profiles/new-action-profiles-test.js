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
  await actionProfileForm.submitFormButton.click();
}

describe('Action profile form', () => {
  setupApplication({ scenarios: ['fetch-action-profiles-success'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/action-profiles');
      await actionProfiles.newActionProfileButton.click();
    });

    it('upon click on new action profile button', () => {
      expect(actionProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(function () {
      this.visit('/settings/data-import/action-profiles?layer=create');
    });

    it('when not filled when the submit button is disabled', () => {
      expect(actionProfileForm.submitFormButtonDisabled).to.be.true;
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
