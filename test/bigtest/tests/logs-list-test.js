import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { setupApplication } from '../helpers';

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

  it('renders the correct number of rows', () => {
    expect(logsList.rowCount).to.equal(3);
  });

  describe('sorting', () => {
    describe('compares fields as strings', () => {
      beforeEach(async () => {
        await logsList.headers(0).click();
      });

      it('ascending', () => {
        expect(getCellContent(0, 0)).to.equal('import_22.mrc');
        expect(getCellContent(1, 0)).to.equal('import_22.mrc');
        expect(getCellContent(2, 0)).to.equal('import_28.mrc');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(0).click();
        });

        it('descending', () => {
          expect(getCellContent(0, 0)).to.equal('import_28.mrc');
          expect(getCellContent(1, 0)).to.equal('import_22.mrc');
          expect(getCellContent(2, 0)).to.equal('import_22.mrc');
        });
      });
    });

    describe('compares fields as numbers', () => {
      beforeEach(async () => {
        await logsList.headers(2).click();
      });

      it('ascending', () => {
        expect(getCellContent(0, 2)).to.equal('01');
        expect(getCellContent(1, 2)).to.equal('02');
        expect(getCellContent(2, 2)).to.equal('03');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(2).click();
        });

        it('descending', () => {
          expect(getCellContent(0, 2)).to.equal('03');
          expect(getCellContent(1, 2)).to.equal('02');
          expect(getCellContent(2, 2)).to.equal('01');
        });
      });
    });

    describe('compares fields as dates', () => {
      it('descending', () => {
        expect(getCellContent(0, 3)).to.equal('11/11/2018, 2:10 PM');
        expect(getCellContent(1, 3)).to.equal('11/5/2018, 2:21 PM');
        expect(getCellContent(2, 3)).to.equal('11/5/2018, 1:08 PM');
      });

      describe('and', () => {
        beforeEach(async () => {
          await logsList.headers(3).click();
        });

        it('ascending', () => {
          expect(getCellContent(0, 3)).to.equal('11/5/2018, 1:08 PM');
          expect(getCellContent(1, 3)).to.equal('11/5/2018, 2:21 PM');
          expect(getCellContent(2, 3)).to.equal('11/11/2018, 2:10 PM');
        });
      });
    });
  });
});
