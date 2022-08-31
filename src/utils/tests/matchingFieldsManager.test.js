import '../../../test/jest/__mock__';

import {
  getFieldMatchedWithCategory,
  getFieldMatchedLabel,
} from '../matchingFieldsManager';

const fields = [{
  label: 'field',
  value: 'instance.identifiers[].value',
}, {
  label: 'identifierTypeId',
  value: '5130aed5-1095-4fb6-8f6f-caa3d6cc7aae',
}];

const resources = {
  identifierTypes: [{
    id: '5130aed5-1095-4fb6-8f6f-caa3d6cc7aae',
    name: 'Local identifier',
    source: 'folio',
  }]
};

describe('matchingFieldsManager', () => {
  describe('getFieldMatchedWithCategory function', () => {
    it('should return value', () => {
      const formatMessage = jest.fn().mockImplementation(() => 'formattedLabel');
      const expectedLabel = getFieldMatchedWithCategory(fields, 'INSTANCE', formatMessage, resources);

      expect(expectedLabel).toBe('formattedLabel: Local identifier');
    });
  });

  describe('getFieldMatchedLabel function', () => {
    describe('when existing record is not MARC', () => {
      it('should return correct label', () => {
        const formatMessage = jest.fn().mockImplementation(() => 'formattedLabel');
        const expectedLabel = getFieldMatchedLabel(fields, 'INSTANCE', formatMessage, resources);

        expect(expectedLabel).toBe('Local identifier');
      });
    });

    describe('when existing record is MARC', () => {
      it('should return correct label', () => {
        const formatMessage = jest.fn().mockImplementation(() => 'formattedLabel');
        const expectedLabel = getFieldMatchedLabel(fields, 'MARC Bibliographic', formatMessage, resources);

        expect(expectedLabel).toBe('instance.identifiers[].value.5130aed5-1095-4fb6-8f6f-caa3d6cc7aae');
      });
    });
  });
});
