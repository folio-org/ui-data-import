import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';

import { marcFieldProtection } from '../../interactors/marc-field-protection';

describe('MARC field protection', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-import/marc-field-protection');
  });

  it('should be rendered', () => {
    expect(marcFieldProtection.hasList).to.be.true;
  });

  it('should have 2 initial rows', () => {
    expect(marcFieldProtection.rowCount).to.be.equal(2);
  });
});
