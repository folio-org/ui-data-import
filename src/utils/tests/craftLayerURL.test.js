import { createLayerURL } from '../craftLayerURL';
import { LAYER_TYPES } from '../constants';

describe('createLayerUrl function', () => {
  it('creates and returns url with given location and type values', () => {
    const location = {
      pathname: '/folio-org/ui-data-import/search',
      search: '?q=searchTerm',
    };
    const type = LAYER_TYPES.DUPLICATE;
    const expected = `${location.pathname}${location.search}&layer=${type}`;

    expect(createLayerURL(location, type)).toBe(expected);
  });
});
