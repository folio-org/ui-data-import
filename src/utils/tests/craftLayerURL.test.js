import { createLayerURL } from '../craftLayerURL';
import { LAYER_TYPES } from '../constants';

const baseUrl = '/folio-org/ui-data-import';
const search = '?q=searchTerm';
const recordId = 'testId';

describe('createLayerUrl function', () => {
  describe('when create new record', () => {
    it('should return the correct path', () => {
      const layerType = LAYER_TYPES.CREATE;
      const expected = `${baseUrl}/${layerType}${search}`;
      const resultUrl = createLayerURL({
        baseUrl,
        layerType,
        search,
      });

      expect(resultUrl).toBe(expected);
    });
  });
  describe('when edit the existing record', () => {
    it('should return the correct path', () => {
      const layerType = LAYER_TYPES.EDIT;
      const expected = `${baseUrl}/${layerType}/${recordId}${search}`;
      const resultUrl = createLayerURL({
        baseUrl,
        layerType,
        search,
        recordId,
      });

      expect(resultUrl).toBe(expected);
    });
  });
  describe('when duplicate the record', () => {
    it('should return the correct path', () => {
      const layerType = LAYER_TYPES.DUPLICATE;
      const expected = `${baseUrl}/${layerType}/${recordId}${search}`;
      const resultUrl = createLayerURL({
        baseUrl,
        layerType,
        search,
        recordId,
      });

      expect(resultUrl).toBe(expected);
    });
  });
});
