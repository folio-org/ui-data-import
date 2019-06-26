import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
  actionProfiles,
  actionProfileDetails,
} from '../../interactors';
import {
  associatedMappingProfile,
  noAssociatedMappingProfile,
} from '../../mocks';

describe('Action Profile View', () => {
  setupApplication({ scenarios: ['fetch-action-profiles-success', 'fetch-users', 'fetch-tags'] });

  beforeEach(function () {
    this.visit('/settings/data-import/action-profiles');
  });

  describe('associated field mapping profile', () => {
    describe('when there is associated profile', () => {
      beforeEach(async function () {
        this.server.get('/data-import-profiles/profileAssociations/:id/details', associatedMappingProfile);
        await actionProfiles.list.rows(0).click();
      });

      it('renders mapping profile', () => {
        expect(actionProfileDetails.associatedMappingProfile.rowCount).to.be.equal(1);
      });
    });

    describe('when there is no associated profile', () => {
      beforeEach(async function () {
        this.server.get('/data-import-profiles/profileAssociations/:id/details', noAssociatedMappingProfile);
        await actionProfiles.list.rows(0).click();
      });

      it('renders empty message', () => {
        expect(actionProfileDetails.associatedMappingProfile.displaysEmptyMessage).to.be.true;
      });
    });
  });

  describe('details pane', () => {
    beforeEach(async () => {
      await actionProfiles.list.rows(0).click();
    });

    it('has correct name', () => {
      expect(actionProfileDetails.headline.text).to.be.equal('Name 0');
    });

    it('has correct description', () => {
      expect(actionProfileDetails.description.text).to.be.equal('Description 0');
    });

    describe('associated job profiles', () => {
      it('has correct amount of items', () => {
        expect(actionProfileDetails.associatedJobProfiles.list.rowCount).to.be.equal(3);
      });

      describe('has select all checkbox', () => {
        beforeEach(async () => {
          await actionProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
        });

        it('upon click changes its state', () => {
          expect(actionProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.true;
        });

        it('selects all items', () => {
          actionProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
            expect(checkBox.isChecked).to.be.true;
          });
        });

        describe('when not all records are selected', () => {
          beforeEach(async () => {
            await actionProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
          });

          it('becomes unchecked', () => {
            expect(actionProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.false;
          });
        });

        describe('when clicked again', () => {
          beforeEach(async () => {
            await actionProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
          });

          it('all items become unchecked', () => {
            actionProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
              expect(checkBox.isChecked).to.be.false;
            });
          });
        });
      });

      describe('has select individual item checkbox', () => {
        beforeEach(async () => {
          await actionProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
        });

        it('upon click changes its state', () => {
          expect(actionProfileDetails.associatedJobProfiles.checkBoxes(0).isChecked).to.be.true;
        });
      });
    });
  });
});
