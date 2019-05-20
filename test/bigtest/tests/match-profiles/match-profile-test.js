import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
  matchProfileDetails,
  matchProfiles,
} from '../../interactors';

describe('Match Profile View', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-users'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/match-profiles');
    await matchProfiles.list.rows(0).click();
  });

  it('has correct name', () => {
    expect(matchProfileDetails.headline.text).to.be.equal('POL-MARC');
  });

  it('has correct description', () => {
    expect(matchProfileDetails.description.text).to.be.equal('Use for POL in 990 $p');
  });

  it('upon click on row', () => {
    expect(matchProfileDetails.isPresent).to.be.true;
  });

  describe('associated job profiles', () => {
    it('has correct amount of items', () => {
      expect(matchProfileDetails.associatedJobProfiles.list.rowCount).to.be.equal(3);
    });

    describe('has select all checkbox', () => {
      beforeEach(async () => {
        await matchProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(matchProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.true;
      });

      it('selects all items', () => {
        matchProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
          expect(checkBox.isChecked).to.be.true;
        });
      });

      describe('when not all records are selected', () => {
        beforeEach(async () => {
          await matchProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
        });

        it('becomes unchecked', () => {
          expect(matchProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.false;
        });
      });

      describe('when clocked again', () => {
        beforeEach(async () => {
          await matchProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
        });

        it('all items become unchecked', () => {
          matchProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
            expect(checkBox.isChecked).to.be.false;
          });
        });
      });
    });

    describe('has select individual item checkbox', () => {
      beforeEach(async () => {
        await matchProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(matchProfileDetails.associatedJobProfiles.checkBoxes(0).isChecked).to.be.true;
      });
    });
  });
});
