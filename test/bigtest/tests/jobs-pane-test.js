import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import {
  PREVIEW_JOBS_LENGTH,
  RUNNING_JOBS_LENGTH,
} from '../mocks/job-executions';
import translation from '../../../translations/ui-data-import/en';
import { setupApplication } from '../helpers';
import { jobsPane } from '../interactors';

describe('Jobs pane', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/data-import');
  });

  it('renders', () => {
    expect(jobsPane.isPresent).to.be.true;
  });

  it('has correct title', () => {
    expect(jobsPane.title).to.be.equal(translation.jobsPaneTitle);
  });

  describe('previews jobs section', () => {
    it('renders', () => {
      expect(jobsPane.previewJobs.isPresent).to.be.true;
    });

    it('has correct title', () => {
      expect(jobsPane.previewJobsTitleText).to.be.equal(translation.previewJobs);
    });
  });

  describe('running jobs section', () => {
    it('renders', () => {
      expect(jobsPane.previewJobs.isPresent).to.be.true;
    });

    it('has correct title', () => {
      expect(jobsPane.runningJobsTitleText).to.be.equal(translation.runningJobs);
    });
  });

  describe('when job data is empty', () => {
    describe('jobs preview section', () => {
      it('renders empty message', () => {
        expect(jobsPane.previewJobs.emptyMessage.isPresent).to.be.true;
      });
    });

    describe('jobs running section', () => {
      it('renders empty message', () => {
        expect(jobsPane.runningJobs.emptyMessage.isPresent).to.be.true;
      });
    });
  });
});

describe('Jobs pane when jobs data retrieved successfully', () => {
  setupApplication({ scenarios: ['fetch-jobs-data-success'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  describe('jobs preview section', () => {
    it('renders jobs list', () => {
      expect(jobsPane.previewJobs.jobsList.isPresent).to.be.true;
    });

    it('has correct job items amount', () => {
      expect(jobsPane.previewJobs.jobItems()).to.have.lengthOf(PREVIEW_JOBS_LENGTH);
    });
  });

  describe('jobs running section', () => {
    it('renders jobs list', () => {
      expect(jobsPane.runningJobs.jobsList.isPresent).to.be.true;
    });

    it('has correct job items amount', () => {
      expect(jobsPane.runningJobs.jobItems()).to.have.lengthOf(RUNNING_JOBS_LENGTH);
    });
  });
});

describe('Jobs pane when unable to fetch jobs data', () => {
  setupApplication({ scenarios: ['fetch-jobs-data-error'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  describe('jobs preview section', () => {
    it('renders empty message', () => {
      expect(jobsPane.previewJobs.emptyMessage.isPresent).to.be.true;
    });
  });

  describe('jobs running section', () => {
    it('renders empty message', () => {
      expect(jobsPane.runningJobs.emptyMessage.isPresent).to.be.true;
    });
  });
});
