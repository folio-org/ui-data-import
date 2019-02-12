import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { setupApplication } from '../helpers';
import JobsLogs from '../interactors/jobs-pane';

describe('Logs pane', () => {
  setupApplication({ scenarios: ['fetch-jobs-logs-success'] });

  beforeEach(function () {
    this.visit('/data-import');
  });

  it('renders', () => {
    expect(JobsLogs.isPresent).to.be.true;
  });
});
