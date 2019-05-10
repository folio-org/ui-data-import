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
  });
});

