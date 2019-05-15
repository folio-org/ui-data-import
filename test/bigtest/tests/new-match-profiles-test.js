import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';

import {
  matchProfiles,
  matchProfileForm,
} from '../interactors';

describe('Match profile form', () => {
  setupApplication();

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/match-profiles');
      await matchProfiles.newMatchProfileButton.click();
    });

    it('upon click on new match profile button', () => {
      expect(matchProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(function () {
      this.visit('/settings/data-import/match-profiles?layer=create');
    });

    it('when not filled when the submit button is disabled', () => {
      expect(matchProfileForm.submitFormButtonDisabled).to.be.true;
    });

    describe('when filled correctly', () => {
      beforeEach(async () => {
        await matchProfileForm.nameField.fillAndBlur('Valid name');
        await matchProfileForm.descriptionField.fillAndBlur('Valid description');
      });

      it('the submit button is not disabled', () => {
        expect(matchProfileForm.submitFormButtonDisabled).to.be.false;
      });
    });
  });
});
