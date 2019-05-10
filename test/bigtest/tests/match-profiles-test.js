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
    
    describe('has correctly built Match column', () => {
      describe('when current language is LTR', () => {
        beforeEach(async () => {
          document.dir = 'ltr';
        });

        it('for record #1', () => {
          expect(matchProfiles.list.rows(0).cells(2).content).to.equal('Order · 990 → PO Line Number');  
        });
        
        it('for record #2', () => {
          expect(matchProfiles.list.rows(1).cells(2).content).to.equal('Instance · 020 → ISBN');  
        });
        
        it('for record #3', () => {
          expect(matchProfiles.list.rows(2).cells(2).content).to.equal('MARC Bibliographic · 935 → 035');  
        });
        
        it('for record #4', () => {
          expect(matchProfiles.list.rows(3).cells(2).content).to.equal('Instance · 001 → Instance HRID');
        });
        
        it('for record #5', () => {
          expect(matchProfiles.list.rows(4).cells(2).content).to.equal('Holdings · Holdings → Location Code');
        });
        
        it('for record #6', () => {
          expect(matchProfiles.list.rows(5).cells(2).content).to.equal('MARC Authority · 010 → 010');
        });
        
        it('for record #7', () => {
          expect(matchProfiles.list.rows(6).cells(2).content).to.equal('MARC Bibliographic · 035 → 035');
        });
        
        it('for record #8', () => {
          expect(matchProfiles.list.rows(7).cells(2).content).to.equal('Order · TBD → PO Line Number');
        });
      })
      
      describe('when current language is RTL', () => {
        beforeEach(async () => {
          document.dir = 'rtl';
        });

        it('for record #1', () => {
          expect(matchProfiles.list.rows(0).cells(2).content).to.equal('PO Line Number ← 990 · Order');  
        });
        
        it('for record #2', () => {
          expect(matchProfiles.list.rows(1).cells(2).content).to.equal('ISBN ← 020 · Instance');    
        });
        
        it('for record #3', () => {
          expect(matchProfiles.list.rows(2).cells(2).content).to.equal('035 ← 935 · MARC Bibliographic');  
        });
        
        it('for record #4', () => {
          expect(matchProfiles.list.rows(3).cells(2).content).to.equal('Instance HRID ← 001 · Instance');
        });
        
        it('for record #5', () => {
          expect(matchProfiles.list.rows(4).cells(2).content).to.equal('Location Code ← Holdings · Holdings');
        });
        
        it('for record #6', () => {
          expect(matchProfiles.list.rows(5).cells(2).content).to.equal('010 ← 010 · MARC Authority');
        });
        
        it('for record #7', () => {
          expect(matchProfiles.list.rows(6).cells(2).content).to.equal('035 ← 035 · MARC Bibliographic');
        });
        
        it('for record #8', () => {
          expect(matchProfiles.list.rows(7).cells(2).content).to.equal('PO Line Number ← TBD · Order');
        });
      })
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
