import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import translation from '../../../translations/ui-data-import/en';
import { setupApplication } from '../helpers';
import { jobsPane } from '../interactors/jobs-pane';

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
      expect(jobsPane.previewJobs.jobItems(0).dateLabelText).to.be.equal(translation.endedRunning);
    });
  });

  describe('preview in progress', () => {
    it('has progress bar', () => {
      expect(jobsPane.previewJobs.jobItems(4).progressBar.isPresent).to.be.true;
    });

    it('has correct date label', () => {
      expect(jobsPane.previewJobs.jobItems(4).dateLabelText).to.be.equal(translation.beganRunning);
    });
  });

  describe('running in progress', () => {
    it('has progress bar', () => {
      expect(jobsPane.runningJobs.jobItems(0).progressBar.isPresent).to.be.true;
    });

    it('has correct date label', () => {
      expect(jobsPane.runningJobs.jobItems(0).dateLabelText).to.be.equal(translation.beganRunning);
    });
  });
});
