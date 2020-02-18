import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../../translations/ui-data-import/en';
import { setupApplication } from '../../helpers';
import {
  mappingProfiles,
  mappingProfileDetails,
} from '../../interactors';

describe('Mapping profiles', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  beforeEach(function () {
    this.visit('/settings/data-import/mapping-profiles');
  });

  describe('search form after enter data in search field', () => {
    beforeEach(async () => {
      await mappingProfiles.searchField.fill('Name 1');
    });

    it('search button is active', () => {
      expect(mappingProfiles.searchSubmitButtonDisabled).to.be.false;
    });

    describe('and after click on search button', () => {
      beforeEach(async () => {
        await mappingProfiles.searchSubmitButton.click();
      });

      it('renders proper amount of items', () => {
        expect(mappingProfiles.list.rowCount).to.equal(1);
      });
    });
  });

  describe('table', () => {
    it('renders proper amount of items', () => {
      expect(mappingProfiles.list.rowCount).to.equal(5);
    });

    it('has proper columns order', () => {
      expect(mappingProfiles.list.headers(1).text).to.equal(translation.name);
      expect(mappingProfiles.list.headers(2).text).to.equal(translation.folioRecordType);
      expect(mappingProfiles.list.headers(3).text).to.equal(translation.tags);
      expect(mappingProfiles.list.headers(4).text).to.equal(translation.updated);
      expect(mappingProfiles.list.headers(5).text).to.equal(translation.updatedBy);
    });

    describe('has select all checkbox', () => {
      beforeEach(async () => {
        await mappingProfiles.selectAllCheckBox.clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(mappingProfiles.selectAllCheckBox.isChecked).to.be.true;
      });
    });

    describe('has select individual item checkbox', () => {
      beforeEach(async () => {
        await mappingProfiles.checkBoxes(0).clickAndBlur();
      });

      it('upon click changes its state', () => {
        expect(mappingProfiles.checkBoxes(0).isChecked).to.be.true;
      });
    });

    describe('opens job profile details', () => {
      beforeEach(async () => {
        await mappingProfiles.list.rows(0).click();
      });

      it('upon click on row', () => {
        expect(mappingProfileDetails.isPresent).to.be.true;
      });
    });
  });
});
