import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../../translations/ui-data-import/en';
import { setupApplication } from '../../helpers';
import {
  matchProfiles,
  matchProfileDetails,
} from '../../interactors';
import { htmlDecode } from '../../../../src/utils';

describe('Match profiles', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-users', 'fetch-tags'] });

  beforeEach(function () {
    this.visit('/settings/data-import/match-profiles');
  });

  describe('search form', () => {
    it('renders search button', () => {
      expect(matchProfiles.searchSubmitButton.isPresent).to.be.true;
      expect(matchProfiles.searchSubmitButton.text).to.equal('Search');
      expect(matchProfiles.searchSubmitButtonDisabled).to.be.true;
    });

    describe('after enter data in search field', () => {
      beforeEach(async () => {
        await matchProfiles.searchField.fill('rde');
      });

      it('search button is active', () => {
        expect(matchProfiles.searchSubmitButtonDisabled).to.be.false;
      });

      describe('and after click on search button', () => {
        beforeEach(async () => {
          await matchProfiles.searchSubmitButton.click();
        });

        it('renders proper amount of items', () => {
          expect(matchProfiles.list.rowCount).to.equal(1);
        });
      });
    });
  });

  describe('table', () => {
    it('renders proper amount of items', () => {
      expect(matchProfiles.list.rowCount).to.equal(10);
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
        expect(matchProfiles.list.rowCount).to.equal(10);
      });

      describe('and', () => {
        beforeEach(async () => {
          await matchProfiles.list.headers(1).click();
        });

        it('by second column', () => {
          expect(matchProfiles.list.rowCount).to.equal(10);
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

    describe('select all checkbox', () => {
      beforeEach(async () => {
        await matchProfiles.selectAllCheckBox.clickAndBlur();
      });

      it('selects all items', () => {
        matchProfiles.checkBoxes().forEach(checkBox => {
          expect(checkBox.isChecked).to.be.true;
        });
      });

      describe('when not all records are selected', () => {
        beforeEach(async () => {
          await matchProfiles.checkBoxes(0).clickAndBlur();
        });

        it('becomes unchecked', () => {
          expect(matchProfiles.selectAllCheckBox.isChecked).to.be.false;
        });
      });

      describe('when clocked again', () => {
        beforeEach(async () => {
          await matchProfiles.selectAllCheckBox.clickAndBlur();
        });

        it('all items become unchecked', () => {
          matchProfiles.checkBoxes().forEach(checkBox => {
            expect(checkBox.isChecked).to.be.false;
          });
        });
      });
    });

    describe('select all button', () => {
      beforeEach(async () => {
        await matchProfiles.actionMenu.click();
        await matchProfiles.actionMenu.selectAllButton.click();
      });

      it('selects all items', () => {
        matchProfiles.checkBoxes().forEach(checkBox => {
          expect(checkBox.isChecked).to.be.true;
        });
      });
    });

    describe('deselect all button', () => {
      beforeEach(async () => {
        await matchProfiles.checkBoxes(0).clickAndBlur();
        await matchProfiles.checkBoxes(1).clickAndBlur();
        await matchProfiles.actionMenu.click();
        await matchProfiles.actionMenu.deselectAllButton.click();
      });

      it('deselects all items', () => {
        matchProfiles.checkBoxes().forEach(checkBox => {
          expect(checkBox.isChecked).to.be.false;
        });
      });
    });

    describe('has correctly built Match column', () => {
      describe('when current language is LTR', () => {
        beforeEach(async () => {
          document.dir = 'ltr';
        });

        it('for record #1', () => {
          expect(matchProfiles.list.rows(0).cells(2).content).to.equal(htmlDecode('Instance&nbsp;&middot;&nbsp;Instance&nbsp;&rarr;&nbsp;Instance HRID'));
        });

        it('for record #2', () => {
          expect(matchProfiles.list.rows(1).cells(2).content).to.equal(htmlDecode('Order&nbsp;&middot;&nbsp;Order&nbsp;&rarr;&nbsp;POL number'));
        });

        it('for record #3', () => {
          expect(matchProfiles.list.rows(2).cells(2).content).to.equal(htmlDecode('Invoice&nbsp;&middot;&nbsp;Invoice&nbsp;&rarr;&nbsp;Vendor invoice number'));
        });

        it('for record #4', () => {
          expect(matchProfiles.list.rows(3).cells(2).content).to.equal(htmlDecode('Item&nbsp;&middot;&nbsp;Item&nbsp;&rarr;&nbsp;Barcode'));
        });

        it('for record #5', () => {
          expect(matchProfiles.list.rows(4).cells(2).content).to.equal(htmlDecode('MARC Bibliographic&nbsp;&middot;&nbsp;MARC Bibliographic&nbsp;&rarr;&nbsp;035. . .a'));
        });

        it('for record #6', () => {
          expect(matchProfiles.list.rows(5).cells(2).content).to.equal(htmlDecode('MARC Authority&nbsp;&middot;&nbsp;MARC Authority&nbsp;&rarr;&nbsp;010. . .a'));
        });

        it('for record #7', () => {
          expect(matchProfiles.list.rows(6).cells(2).content).to.equal(htmlDecode('Instance&nbsp;&middot;&nbsp;Instance&nbsp;&rarr;&nbsp;Identifier'));
        });

        it('for record #8', () => {
          expect(matchProfiles.list.rows(7).cells(2).content).to.equal(htmlDecode('MARC Bibliographic&nbsp;&middot;&nbsp;MARC Bibliographic&nbsp;&rarr;&nbsp;035...a'));
        });
      });

      describe('when current language is RTL', () => {
        beforeEach(async () => {
          document.dir = 'rtl';
        });

        it('for record #1', () => {
          expect(matchProfiles.list.rows(0).cells(2).content).to.equal(htmlDecode('Instance HRID&nbsp;&larr;&nbsp;Instance&nbsp;&middot;&nbsp;Instance'));
        });

        it('for record #2', () => {
          expect(matchProfiles.list.rows(1).cells(2).content).to.equal(htmlDecode('POL number&nbsp;&larr;&nbsp;Order&nbsp;&middot;&nbsp;Order'));
        });

        it('for record #3', () => {
          expect(matchProfiles.list.rows(2).cells(2).content).to.equal(htmlDecode('Vendor invoice number&nbsp;&larr;&nbsp;Invoice&nbsp;&middot;&nbsp;Invoice'));
        });

        it('for record #4', () => {
          expect(matchProfiles.list.rows(3).cells(2).content).to.equal(htmlDecode('Barcode&nbsp;&larr;&nbsp;Item&nbsp;&middot;&nbsp;Item'));
        });

        it('for record #5', () => {
          expect(matchProfiles.list.rows(4).cells(2).content).to.equal(htmlDecode('a. . .035&nbsp;&larr;&nbsp;MARC Bibliographic&nbsp;&middot;&nbsp;MARC Bibliographic'));
        });

        it('for record #6', () => {
          expect(matchProfiles.list.rows(5).cells(2).content).to.equal(htmlDecode('a. . .010&nbsp;&larr;&nbsp;MARC Authority&nbsp;&middot;&nbsp;MARC Authority'));
        });

        it('for record #7', () => {
          expect(matchProfiles.list.rows(6).cells(2).content).to.equal(htmlDecode('Identifier&nbsp;&larr;&nbsp;Instance&nbsp;&middot;&nbsp;Instance'));
        });

        it('for record #8', () => {
          expect(matchProfiles.list.rows(7).cells(2).content).to.equal(htmlDecode('a...035&nbsp;&larr;&nbsp;MARC Bibliographic&nbsp;&middot;&nbsp;MARC Bibliographic'));
        });
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
