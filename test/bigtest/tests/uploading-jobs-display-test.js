import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import { uploadingJobsDisplay } from '../interactors';

describe('Uploading jobs display', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/data-import/job-profile');
  });

  it('renders', () => {
    expect(uploadingJobsDisplay.isPresent).to.be.true;
  });
});
