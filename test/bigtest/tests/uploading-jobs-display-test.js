import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { setupApplication } from '../helpers';
import { uploadingJobsDisplay } from '../interactors/uploading-jobs-display';

describe('Uploading jobs display', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/data-import/job-profile');
  });

  it('renders', () => {
    expect(uploadingJobsDisplay.isPresent).to.be.true;
  });
});
