import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import { searchAndSort } from '../interactors/search-and-sort-pane';
import { setupApplication } from '../helpers';

const logsList = new MultiColumnListInteractor('#list-data-import');
const getCellContent = (row, cell) => logsList.rows(row).cells(cell).content;

const LOGS_COUNT = 3;

describe.only('View all logs', () => {
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
  });
});
