import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import { jobLog } from '../interactors';

describe('Job log view', () => {
  setupApplication({ scenarios: ['fetch-job-log-success'] });

  beforeEach(function () {
    this.visit('/data-import/log/00000000-0000-0000-0000-000000000000');
  });

  it('is visible', () => {
    expect(jobLog.isPresent).to.be.true;
    expect(jobLog.entriesTotal.isPresent).to.be.true;
    expect(jobLog.entriesTotal.text).contains('3');
    expect(jobLog.errorsTotal.isPresent).to.be.true;
    expect(jobLog.errorsTotal.text).contains('1');
    expect(jobLog.logsPane.isPresent).to.be.true;
  });
});
