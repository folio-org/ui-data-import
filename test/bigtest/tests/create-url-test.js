import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { createUrl } from '../../../src/utils';

describe('createUrl function', () => {
  it('creates correct url', () => {
    const createdUrl = createUrl('http://api.com/users', {
      limit: 50,
      id: 'identifier',
    });
    const correctUrl = 'http://api.com/users?limit=50&id=identifier';

    expect(createdUrl).to.equal(correctUrl);
  });

  it('handles question sign correctly', () => {
    expect(createUrl('http://api.com/users?')).to.equal(createUrl('http://api.com/users'));
  });
});
