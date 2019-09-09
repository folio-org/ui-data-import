import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../../translations/ui-data-import/en';
import { setupApplication } from '../../helpers';
import {
  actionProfiles,
  actionProfileDetails,
} from '../../interactors';

describe('Action profiles', () => {
  setupApplication({ scenarios: ['fetch-action-profiles-success', 'fetch-users', 'fetch-tags'] });

  beforeEach(function () {
    this.visit('/settings/data-import/action-profiles');
  });

  describe('search form after enter data in search field', () => {
    beforeEach(async () => {
      await actionProfiles.searchField.fill('rde');
    });

    it('search button is active', () => {
      expect(actionProfiles.searchSubmitButtonDisabled).to.be.false;
    });

    describe('and after click on search button', () => {
      beforeEach(async () => {
        await actionProfiles.searchSubmitButton.click();
      });

      it('renders proper amount of items', () => {
        expect(actionProfiles.list.rowCount).to.equal(1);
      });
    });
  });

  describe('table', () => {
    it('renders proper amount of items', () => {
      expect(actionProfiles.list.rowCount).to.equal(8);
    });

    it('has proper columns order', () => {
      expect(actionProfiles.list.headers(1).text).to.equal(translation.name);
      expect(actionProfiles.list.headers(2).text).to.equal(translation.action);
      expect(actionProfiles.list.headers(3).text).to.equal(translation.mapping);
      expect(actionProfiles.list.headers(4).text).to.equal(translation.tags);
      expect(actionProfiles.list.headers(5).text).to.equal(translation.updated);
      expect(actionProfiles.list.headers(6).text).to.equal(translation.updatedBy);
    });

    // TODO: remove `.skip` from checkbox tests when MCL component is fixed
    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('has select all checkbox', () => {
      beforeEach(async () => {
        await actionProfiles.selectAllCheckBox.clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(actionProfiles.selectAllCheckBox.isChecked).to.be.true;
      });
    });

    // TODO: remove `.skip` from checkbox tests when MCL component is fixed
    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('has select individual item checkbox', () => {
      beforeEach(async () => {
        await actionProfiles.checkBoxes(0).clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(actionProfiles.checkBoxes(0).isChecked).to.be.true;
      });
    });

    describe('opens job profile details', () => {
      beforeEach(async () => {
        await actionProfiles.list.rows(0).click();
      });

      it('upon click on row', () => {
        expect(actionProfileDetails.isPresent).to.be.true;
      });
    });

    // TODO: remove `.skip` from checkbox tests when MCL component is fixed
    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('select all button', () => {
      beforeEach(async () => {
        await actionProfiles.actionMenu.click();
        await actionProfiles.actionMenu.selectAllButton.click();
      });

      it('selects all items', () => {
        actionProfiles.checkBoxes().forEach(checkBox => {
          expect(checkBox.isChecked).to.be.true;
        });
      });
    });

    // TODO: remove `.skip` from checkbox tests when MCL component is fixed
    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('deselect all button', () => {
      beforeEach(async () => {
        await actionProfiles.checkBoxes(0).clickAndBlur();
        await actionProfiles.checkBoxes(1).clickAndBlur();
        await actionProfiles.actionMenu.click();
        await actionProfiles.actionMenu.deselectAllButton.click();
      });

      it('deselects all items', () => {
        actionProfiles.checkBoxes().forEach(checkBox => {
          expect(checkBox.isChecked).to.be.false;
        });
      });
    });
  });
});
