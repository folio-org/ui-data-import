import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import { jobsPane } from '../../interactors';

describe('Job item', () => {
  setupApplication({ scenarios: ['fetch-jobs-data-success'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  describe('ready for preview', () => {
    it('has "Preview now" button', () => {
      expect(jobsPane.previewJobs.jobItems(0).previewNowButton.isPresent).to.be.true;
    });

    it('has correct date label', () => {
      expect(jobsPane.previewJobs.jobItems(0).dateLabelText).contains('Ended');
    });
  });

  describe('preview in progress', () => {
    it('has progress bar', () => {
      expect(jobsPane.previewJobs.jobItems(4).progressBar.isPresent).to.be.true;
    });

    it('has correct date label', () => {
      expect(jobsPane.previewJobs.jobItems(4).dateLabelText).contains('Began');
    });
  });

  describe('running in progress', () => {
    it('has progress bar', () => {
      expect(jobsPane.runningJobs.jobItems(0).progressBar.isPresent).to.be.true;
    });

    it('has correct date label', () => {
      expect(jobsPane.runningJobs.jobItems(0).dateLabelText).contains('Began');
    });
  });
});
