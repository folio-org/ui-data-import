import { createLayerURL } from '../craftLayerURL';
import { LAYER_TYPES } from '../constants';

describe('createLayerUrl function', () => {
  describe('when create new record', () => {
    it('should return the correct path', () => {
      const location = {
        pathname: '/folio-org/ui-data-import/search',
        search: '?q=searchTerm',
      };
      const type = LAYER_TYPES.CREATE;
      const expected = `${location.pathname}/${type}${location.search}`;

      expect(createLayerURL(location, type)).toBe(expected);
    });
  });
  describe('when edit the existing record', () => {
    it('should return the correct path', () => {
      const location = {
        pathname: '/folio-org/ui-data-import/search/view/testId',
        search: '?q=searchTerm',
      };
      const type = LAYER_TYPES.EDIT;
      const expected = `/folio-org/ui-data-import/search/${type}/testId${location.search}`;

      expect(createLayerURL(location, type)).toBe(expected);
    });
  });
  describe('when duplicate the record', () => {
    it('should return the correct path', () => {
      const location = {
        pathname: '/folio-org/ui-data-import/search/view/testId',
        search: '?q=searchTerm',
      };
      const type = LAYER_TYPES.DUPLICATE;
      const expected = `/folio-org/ui-data-import/search/${type}/testId${location.search}`;

      expect(createLayerURL(location, type)).toBe(expected);
    });
  });
});
