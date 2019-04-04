import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import {
  jobProfiles,
  jobProfileForm,
} from '../interactors';

describe('Job profile form', () => {
  setupApplication();

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/job-profiles');
      await jobProfiles.newJobProfileButton.click();
    });

    it('upon click on new job profile button', () => {
      expect(jobProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(function () {
      this.visit('/settings/data-import/job-profiles?layer=create');
    });

    it('when not filled then the submit button is disabled', () => {
      expect(jobProfileForm.submitFormButtonDisabled).to.be.true;
    });

    describe('when filled correctly', () => {
      beforeEach(async () => {
        await jobProfileForm.nameFiled.fillAndBlur('Valid name');
        await jobProfileForm.dataTypeField.selectAndBlur('MARC');
        await jobProfileForm.descriptionField.fillAndBlur('Valid description');
      });

      it('the submit button is not disabled', () => {
        expect(jobProfileForm.submitFormButtonDisabled).to.be.false;
      });
    });
  });
});
