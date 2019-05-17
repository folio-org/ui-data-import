import { expect } from 'chai';
import {
  describe,
  it,
} from '@bigtest/mocha';

import { htmlDecode } from '../../../../src/utils';

describe('htmlDecode function', () => {
  it('decodes HTML special chars in the given string', () => {
    expect(htmlDecode('Order&nbsp;&middot;&nbsp;990&nbsp;&rarr;&nbsp;PO Line Number')).to.equal('Order · 990 → PO Line Number');
  });
});
