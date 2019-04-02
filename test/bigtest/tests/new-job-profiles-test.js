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

import translation from '../../../translations/ui-data-import/en';

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

    describe('when name field', () => {
      describe('is empty after blur', () => {
        beforeEach(async () => {
          await jobProfileForm.nameFiled.focusInput();
          await jobProfileForm.nameFiled.blurInput();
        });

        it('then the error message appears', () => {
          expect(jobProfileForm.nameFiled.inputError).to.be.true;
        });
      });

      describe('is valid', () => {
        beforeEach(async () => {
          await jobProfileForm.nameFiled.fillAndBlur('Valid name');
        });

        it('then the error message does not appear', () => {
          expect(jobProfileForm.nameFiled.inputError).to.be.false;
        });
      });
    });

    describe('when the data type field', () => {
      describe('is empty after blur', () => {
        beforeEach(async () => {
          await jobProfileForm.dataTypeField.focusSelect();
          await jobProfileForm.dataTypeField.blurSelect();
        });

        it('then the error message appears', () => {
          expect(jobProfileForm.dataTypeField.hasErrorStyle).to.be.true;
        });

        it('and the error message is correct', () => {
          expect(jobProfileForm.dataTypeField.errorText).to.be.equal(translation['validation.enterValue']);
        });
      });

      describe('is chosen', () => {
        beforeEach(async () => {
          await jobProfileForm.dataTypeField.selectAndBlur('MARC');
        });

        it('then the error message does not appear', () => {
          expect(jobProfileForm.dataTypeField.hasErrorStyle).to.be.false;
        });
      });
    });
  });
});
