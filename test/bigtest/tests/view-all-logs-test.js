import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { searchAndSort } from '../interactors/search-and-sort-pane';
import { setupApplication } from '../helpers';
import translation from '../../../translations/ui-data-import/en';

const logsList = new MultiColumnListInteractor('#list-data-import');
const getCellContent = (row, cell) => logsList.rows(row).cells(cell).content;

const LOGS_COUNT = 4;

describe('View all logs', () => {
  setupApplication({ scenarios: ['fetch-jobs-logs-success'] });

  beforeEach(function () {
    this.visit('/data-import/job-logs');
  });

  it('should render logs list', () => {
    expect(logsList.isPresent).to.be.true;
  });

  it('should render the correct number of rows', () => {
    expect(logsList.rowCount).to.equal(LOGS_COUNT);
  });

  it('sorted default by "completedDate" descending', () => {
    expect(getCellContent(0, 4)).to.equal('11/11/2018, 2:10 PM');
    expect(getCellContent(1, 4)).to.equal('11/5/2018, 2:21 PM');
    expect(getCellContent(2, 4)).to.equal('11/5/2018, 1:08 PM');
  });

  describe('SearchAndSort pane', () => {
    it('renders', () => {
      expect(searchAndSort.isPresent).to.be.true;
    });

    it('has a collapse button', () => {
      expect(searchAndSort.collapseFilterPaneButton.isPresent).to.be.true;
    });

    it('has a resetAll button', () => {
      expect(searchAndSort.resetButton.isPresent).to.be.true;
    });

    it('resetAll button is disable by default', () => {
      expect(searchAndSort.resetButton.isDisabled).to.be.true;
    });

    describe('fill search input', () => {
      beforeEach(async () => {
        await searchAndSort.searchInput.fillInput('Valid name');
      });

      it('resetAll button is active', () => {
        expect(searchAndSort.resetButton.isDisabled).to.be.false;
      });
    });

    describe('Filter pane', () => {
      it('renders', () => {
        expect(searchAndSort.filters.isPresent).to.be.true;
      });

      it('renders name of filters correct', () => {
        expect(searchAndSort.filters.labels(0).text).to.equal(translation['filter.errors']);
        expect(searchAndSort.filters.labels(1).text).to.equal(translation['filter.date']);
        expect(searchAndSort.filters.labels(2).text).to.equal(translation['filter.jobProfile']);
        expect(searchAndSort.filters.labels(3).text).to.equal(translation['filter.user']);
      });

      describe('enter valid value to date field', () => {
        beforeEach(async function () {
          await searchAndSort.filters.fillDateOrderedStart('2019-01-01');
          await searchAndSort.filters.fillDateOrderedEnd('2019-08-01');
          await searchAndSort.filters.applyDateOrdered.click();
        });

        it('should load list without errors', () => {
          expect(logsList.rowCount).to.equal(LOGS_COUNT);
          expect(searchAndSort.filters.hasErrorMessage).to.be.false;
        });
      });

      describe('enter invalid value to date field', () => {
        beforeEach(async function () {
          await searchAndSort.filters.fillDateOrderedStart('2019-54-01');
          await searchAndSort.filters.fillDateOrderedEnd('2019-87-01');
          await searchAndSort.filters.applyDateOrdered.click();
        });

        it('error message should appear', () => {
          expect(searchAndSort.filters.hasErrorMessage).to.be.true;
        });
      });

      describe('"Job profiles" selection field', () => {
        beforeEach(async function () {
          await searchAndSort.filters.jobProfile.clickControl();
        });

        it('renders', () => {
          expect(searchAndSort.filters.jobProfile.controlPresent).to.be.true;
        });

        it('does not have a value', () => {
          expect(searchAndSort.filters.jobProfile.valLabel).to.equal('');
        });
      });

      describe('"Users" selection field', () => {
        beforeEach(async function () {
          await searchAndSort.filters.users.clickControl();
        });

        it('renders', () => {
          expect(searchAndSort.filters.users.controlPresent).to.be.true;
        });

        it('does not have a value', () => {
          expect(searchAndSort.filters.jobProfile.valLabel).to.equal('');
        });
      });
    });
  });
});
