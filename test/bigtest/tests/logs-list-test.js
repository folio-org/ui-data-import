import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { setupApplication } from '../helpers';
import translation from '../../../translations/ui-data-import/en';

const logsList = new MultiColumnListInteractor('#job-logs-list');
const getCellContent = (row, cell) => logsList.rows(row).cells(cell).content;

describe('Logs list', () => {
  setupApplication({ scenarios: ['fetch-jobs-logs-success'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  it('renders', () => {
    expect(logsList.isPresent).to.be.true;
  });

  it('renders headers in correct order', () => {
    expect(logsList.headers(0).text).to.equal(translation.fileName);
    expect(logsList.headers(1).text).to.equal(translation.jobExecutionHrId);
    expect(logsList.headers(2).text).to.equal(translation.jobProfileName);
    expect(logsList.headers(3).text).to.equal(translation.records);
    expect(logsList.headers(4).text).to.equal(translation.jobCompletedDate);
    expect(logsList.headers(5).text).to.equal(translation.runBy);
  });

  it('renders the correct number of rows', () => {
    expect(logsList.rowCount).to.equal(4);
  });

  it('sorted default by "completedDate" descending', () => {
    expect(getCellContent(0, 4)).to.equal('11/11/2018, 2:10 PM');
    expect(getCellContent(1, 4)).to.equal('11/5/2018, 2:22 PM');
    expect(getCellContent(2, 4)).to.equal('11/5/2018, 2:21 PM');
    expect(getCellContent(3, 4)).to.equal('11/5/2018, 1:08 PM');
  });

  describe('sorting', () => {
    describe('compares fields as strings', () => {
      beforeEach(async () => {
        await logsList.headers(0).click();
      });

      it('ascending', () => {
        expect(getCellContent(0, 0)).to.equal('import_21.mrc');
        expect(getCellContent(1, 0)).to.equal('import_22.mrc');
        expect(getCellContent(2, 0)).to.equal('import_22.mrc');
        expect(getCellContent(3, 0)).to.equal('import_28.mrc');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(0).click();
        });

        it('descending', () => {
          expect(getCellContent(0, 0)).to.equal('import_28.mrc');
          expect(getCellContent(1, 0)).to.equal('import_22.mrc');
          expect(getCellContent(2, 0)).to.equal('import_22.mrc');
          expect(getCellContent(3, 0)).to.equal('import_21.mrc');
        });
      });
    });

    describe('compares fields as numbers', () => {
      beforeEach(async () => {
        await logsList.headers(1).click();
      });

      it('ascending', () => {
        expect(getCellContent(0, 1)).to.equal('01');
        expect(getCellContent(1, 1)).to.equal('02');
        expect(getCellContent(2, 1)).to.equal('03');
        expect(getCellContent(3, 1)).to.equal('03');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(1).click();
        });

        it('descending', () => {
          expect(getCellContent(0, 1)).to.equal('03');
          expect(getCellContent(1, 1)).to.equal('03');
          expect(getCellContent(2, 1)).to.equal('02');
          expect(getCellContent(3, 1)).to.equal('01');
        });
      });
    });

    describe('compares fields as dates', () => {
      it('descending', () => {
        expect(getCellContent(0, 4)).to.equal('11/11/2018, 2:10 PM');
        expect(getCellContent(1, 4)).to.equal('11/5/2018, 2:22 PM');
        expect(getCellContent(2, 4)).to.equal('11/5/2018, 2:21 PM');
        expect(getCellContent(3, 4)).to.equal('11/5/2018, 1:08 PM');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(4).click();
        });

        it('ascending', () => {
          expect(getCellContent(0, 4)).to.equal('11/5/2018, 1:08 PM');
          expect(getCellContent(1, 4)).to.equal('11/5/2018, 2:21 PM');
          expect(getCellContent(2, 4)).to.equal('11/5/2018, 2:22 PM');
          expect(getCellContent(3, 4)).to.equal('11/11/2018, 2:10 PM');
        });
      });
    });

    describe('compares by `runBy` field', () => {
      beforeEach(async () => {
        await logsList.headers(5).click();
      });

      it('ascending', () => {
        expect(getCellContent(0, 5)).to.equal('Elliot Lane');
        expect(getCellContent(1, 5)).to.equal('Elliot Lane');
        expect(getCellContent(2, 5)).to.equal('Jay Morrowitz');
        expect(getCellContent(3, 5)).to.equal('Ozzy Campenshtorm');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(5).click();
        });

        it('descending', () => {
          expect(getCellContent(0, 5)).to.equal('Ozzy Campenshtorm');
          expect(getCellContent(1, 5)).to.equal('Jay Morrowitz');
          expect(getCellContent(2, 5)).to.equal('Elliot Lane');
          expect(getCellContent(3, 5)).to.equal('Elliot Lane');
        });
      });
    });
    describe('compares by `totalRecords` field', () => {
      beforeEach(async () => {
        await logsList.headers(3).click();
      });

      it('ascending', () => {
        expect(getCellContent(0, 3)).to.equal('7');
        expect(getCellContent(1, 3)).to.equal('9');
        expect(getCellContent(2, 3)).to.equal('10');
        expect(getCellContent(3, 3)).to.equal('46');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(3).click();
        });

        it('descending', () => {
          expect(getCellContent(0, 3)).to.equal('46');
          expect(getCellContent(1, 3)).to.equal('10');
          expect(getCellContent(2, 3)).to.equal('9');
          expect(getCellContent(3, 3)).to.equal('7');
        });
      });
    });
    describe('compares by `jobProfileInfo` field', () => {
      beforeEach(async () => {
        await logsList.headers(2).click();
      });

      it('ascending', () => {
        expect(getCellContent(0, 2)).to.equal('BIB profile with customized Holdings');
        expect(getCellContent(1, 2)).to.equal('Multilingual support check');
        expect(getCellContent(2, 2)).to.equal('Standard BIB profile');
        expect(getCellContent(3, 2)).to.equal('Standard BIB profile');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(2).click();
        });

        it('descending', () => {
          expect(getCellContent(0, 2)).to.equal('Standard BIB profile');
          expect(getCellContent(1, 2)).to.equal('Standard BIB profile');
          expect(getCellContent(2, 2)).to.equal('Multilingual support check');
          expect(getCellContent(3, 2)).to.equal('BIB profile with customized Holdings');
        });
      });
    });
  });
});
