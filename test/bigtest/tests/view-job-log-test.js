import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import { jobLog } from '../interactors';
import { jobLog as jobLogMock } from '../mocks';

describe('Job log view', () => {
  setupApplication({ scenarios: ['fetch-job-log-success'] });

  beforeEach(function () {
    this.visit('/data-import/log/00000000-0000-0000-0000-000000000000');
  });

  it('is visible', () => {
    expect(jobLog.isPresent).to.be.true;
    expect(jobLog.total.isPresent).to.be.true;
    expect(jobLog.total.text).contains('3');
    expect(jobLog.logJson.isPresent).to.be.true;
    expect(jobLog.logJson.text.replace(/\s/g, '')).contains(JSON.stringify(jobLogMock));
  });
});
