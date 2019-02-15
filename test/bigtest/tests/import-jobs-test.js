import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import translation from '../../../translations/ui-data-import/en';
import { setupApplication } from '../helpers';
import {
  importJobs,
  returnToAssignJobs,
} from '../interactors/import-pane';

describe('Import files with no previous draft jobs', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/data-import');
  });

  it('renders', () => {
    expect(importJobs.isPresent).to.be.true;
    expect(returnToAssignJobs.isPresent).to.be.false;
  });

  it('has correct title', () => {
    expect(importJobs.title).to.be.equal(translation.uploadTitle);
  });
});

describe('Import files with previous draft jobs', () => {
  setupApplication({ scenarios: ['return-to-assign-jobs'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  it('renders', () => {
    expect(importJobs.isPresent).to.be.false;
    expect(returnToAssignJobs.isPresent).to.be.true;
  });

  it('has correct title', () => {
    expect(returnToAssignJobs.title).to.be.equal(translation['returnToAssign.message']);
  });

  describe('resets to initial state', () => {
    beforeEach(async () => {
      await returnToAssignJobs.deleteFileExtension();
    });

    it('renders', () => {
      expect(importJobs.isPresent).to.be.true;
      expect(returnToAssignJobs.isPresent).to.be.false;
    });
  });
});
