import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../translations/ui-data-import/en';
import { setupApplication } from '../helpers';
import {
  matchProfiles,
  matchProfileDetails,
} from '../interactors';

describe('Match profiles', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/match-profiles');
  });

  describe('table', () => {
    it('renders proper amount of items', () => {
      expect(matchProfiles.list.rowCount).to.equal(8);
    });

    it('has proper columns order', () => {
      expect(matchProfiles.list.headers(1).text).to.equal(translation.name);
      expect(matchProfiles.list.headers(2).text).to.equal(translation.match);
      expect(matchProfiles.list.headers(3).text).to.equal(translation.tags);
      expect(matchProfiles.list.headers(4).text).to.equal(translation.updated);
      expect(matchProfiles.list.headers(5).text).to.equal(translation.updatedBy);
    });

    describe('can sort', () => {
      beforeEach(async () => {
        await matchProfiles.list.headers(0).click();
      });

      it('by first column', () => {
        expect(matchProfiles.list.rowCount).to.equal(8);
      });

      describe('and', () => {
        beforeEach(async () => {
          await matchProfiles.list.headers(1).click();
        });

        it('by second column', () => {
          expect(matchProfiles.list.rowCount).to.equal(8);
        });
      });
    });

    describe('has select all checkbox', () => {
      beforeEach(async () => {
        await matchProfiles.selectAllCheckBox.clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(matchProfiles.selectAllCheckBox.isChecked).to.be.true;
      });
    });

    describe('has select individual item checkbox', () => {
      beforeEach(async () => {
        await matchProfiles.checkBoxes(0).clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(matchProfiles.checkBoxes(0).isChecked).to.be.true;
      });
    });

    describe('has select individual item checkbox', () => {
      beforeEach(async () => {
        await matchProfiles.checkBoxes(0).clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(matchProfiles.checkBoxes(0).isChecked).to.be.true;
      });
    });

    describe('opens job profile details', () => {
      beforeEach(async () => {
        await matchProfiles.list.rows(0).click();
      });

      it('upon click on row', () => {
        expect(matchProfileDetails.isPresent).to.be.true;
      });
    });
  });
});
