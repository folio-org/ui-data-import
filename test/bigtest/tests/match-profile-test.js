import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import {
  matchProfileDetails,
  matchProfiles,
} from '../interactors';

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
