import '../../../test/jest/__mock__';

import { getIdentifierTypes } from '../getIdentifierTypes';

global.fetch = jest.fn();

describe('getIdentifierTypes function', () => {
  it('should fetch data correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 'testId' }),
    });

    const okapi = { url: 'https://test.com' };
    const expectedURL = `${okapi.url}/identifier-types?limit=1000&query=cql.allRecords=1 sortby name`;

    const data = await getIdentifierTypes(okapi);

    expect(global.fetch.mock.calls[0][0]).toBe(expectedURL);
    expect(data).toEqual({ id: 'testId' });
  });

  describe('when there is an error', () => {
    it('should throw a new error', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      const okapi = { url: 'https://test.com' };

      await getIdentifierTypes(okapi);

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0].message).toBe('Cannot get identifier types');

      // eslint-disable-next-line no-console
      console.error.mockReset();
    });
  });
});
