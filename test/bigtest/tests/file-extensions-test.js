import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { setupApplication } from '../helpers';

const fileExtensionsList = new MultiColumnListInteractor('#file-extensions-list');

describe('File extensions table', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  it('renders', () => {
    expect(fileExtensionsList.isPresent).to.be.true;
  });

  it('renders proper amount of items', () => {
    expect(fileExtensionsList.rowCount).to.equal(3);
  });

  describe('can sort', () => {
    beforeEach(async () => {
      await fileExtensionsList.headers(0).click();
    });

    it('by first column', () => {
      expect(fileExtensionsList.rowCount).to.equal(3);
    });

    describe('and', () => {
      beforeEach(async () => {
        await fileExtensionsList.headers(1).click();
      });

      it('by second column', () => {
        expect(fileExtensionsList.rowCount).to.equal(3);
      });
    });
  });
});
