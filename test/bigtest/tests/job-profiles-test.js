import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../translations/ui-data-import/en';
import { setupApplication } from '../helpers';
import {
  jobProfiles,
  jobProfileDetails,
} from '../interactors';

describe('Job profiles', () => {
  setupApplication({ scenarios: ['fetch-job-profiles-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/job-profiles');
  });

  describe('table', () => {
    it('renders proper amount of items', () => {
      expect(jobProfiles.list.rowCount).to.equal(3);
    });

    it('has proper columns order', () => {
      expect(jobProfiles.list.headers(1).text).to.equal(translation.name);
      expect(jobProfiles.list.headers(2).text).to.equal(translation.tags);
      expect(jobProfiles.list.headers(3).text).to.equal(translation.updated);
      expect(jobProfiles.list.headers(4).text).to.equal(translation.updatedBy);
    });

    describe('upon search', () => {
      beforeEach(async () => {
        await jobProfiles.searchFiled.fill('acq');
        await jobProfiles.searchSubmitButton.click();
      });

      it('renders proper amount of items', () => {
        expect(jobProfiles.list.rowCount).to.equal(2);
      });
    });

    describe('can sort', () => {
      beforeEach(async () => {
        await jobProfiles.list.headers(0).click();
      });

      it('by first column', () => {
        expect(jobProfiles.list.rowCount).to.equal(3);
      });

      describe('and', () => {
        beforeEach(async () => {
          await jobProfiles.list.headers(1).click();
        });

        it('by second column', () => {
          expect(jobProfiles.list.rowCount).to.equal(3);
        });
      });
    });

    describe('has select all checkbox', () => {
      beforeEach(async () => {
        await jobProfiles.selectAllCheckBox.clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(jobProfiles.selectAllCheckBox.isChecked).to.be.true;
      });
    });

    describe('has select individual item checkbox', () => {
      beforeEach(async () => {
        await jobProfiles.checkBoxes(0).clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(jobProfiles.checkBoxes(0).isChecked).to.be.true;
      });
    });

    describe('has select individual item checkbox', () => {
      beforeEach(async () => {
        await jobProfiles.checkBoxes(0).clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(jobProfiles.checkBoxes(0).isChecked).to.be.true;
      });
    });

    describe('opens job profile details', () => {
      beforeEach(async () => {
        await jobProfiles.list.rows(0).click();
      });

      it('upon click on row', () => {
        expect(jobProfileDetails.isPresent).to.be.true;
      });
    });
  });
});
