import { expect } from 'chai';
import {
  describe,
  it,
} from '@bigtest/mocha';

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

  it('encodes correctly', () => {
    const createdUrl = createUrl('http://api.com/users', { id: 'hello world!' });
    const correctUrl = 'http://api.com/users?id=hello%20world!';

    expect(createdUrl).to.equal(correctUrl);
  });

  it('does not encodes if encode parameter is false', () => {
    const createdUrl = createUrl('http://api.com/users', { id: 'hello world!' }, false);
    const correctUrl = 'http://api.com/users?id=hello world!';

    expect(createdUrl).to.equal(correctUrl);
  });

  it('handles question sign correctly', () => {
    expect(createUrl('http://api.com/users?')).to.equal(createUrl('http://api.com/users'));
  });
});
