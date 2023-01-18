import React from 'react';

import '../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from '../index';
import { MARC_TYPES } from '../../../../utils';
import MARC_HOLDINGS from '../MARC_HOLDINGS';
import INVOICE from '../INVOICE';
import INSTANCE from '../INSTANCE';

describe('getInitialDetails function', () => {
  describe('when there is no "entity" record type', () => {
    it('should return empty object', () => {
      const actual = getInitialDetails('');

      expect(actual).toEqual({});
    });
  });

  describe('when "entity" record type is MARC', () => {
    it('should return appropriate mapping details', () => {
      const actual = getInitialDetails(MARC_TYPES.MARC_HOLDINGS);

      expect(actual).toEqual(MARC_HOLDINGS);
    });

    describe('when "entity" record type is INVOICE', () => {
      it('should return appropriate INVOICE mapping details', () => {
        const actual = getInitialDetails(FOLIO_RECORD_TYPES.INVOICE.type, true);

        expect(actual.mappingFields.length).toEqual(INVOICE.mappingFields.length);
        expect(actual.name).toBe(INVOICE.name);
        expect(actual.recordType).toBe(FOLIO_RECORD_TYPES.INVOICE.type);
      });
    });
  });
});

describe('getInitialFields function', () => {
  describe('when there is no "entity" record type', () => {
    it('should return an empty object', () => {
      const actual = getInitialFields('');

      expect(actual).toEqual({});
    });
  });

  describe('when "entity" is valid type', () => {
    it('should return appropriate subfields object', () => {
      const expected = INSTANCE.mappingFields.reduce((initialFields, field) => {
        if (field.subfields?.length) {
          return {
            ...initialFields,
            [field.name]: field.subfields[0],
          };
        }

        return initialFields;
      }, {});
      const actual = getInitialFields(FOLIO_RECORD_TYPES.INSTANCE.type);

      expect(actual).not.toEqual({});
      expect(actual).toEqual(expected);
    });
  });
});

describe('getReferenceTables function', () => {
  it('should return reference tables object', () => {
    const fields = [{
      name: 'testName',
      subfields: [{ name: 'testSubfield' }],
    }];
    const expected = { testName: [{ name: 'testSubfield' }] };
    const actual = getReferenceTables(fields);

    expect(actual).toEqual(expected);
  });
});
