import '../../../test/jest/__mock__';
import { STATUS_CODES } from '../constants';

import { deleteJobExecutions } from '../deleteJobExecutions';

global.fetch = jest.fn();
const okapi = {
  url: 'https://test.com',
  tenant: 'tenant',
  token: 'token',
};

describe('deleteJobExecutions function', () => {
  it('fetches correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({ jobExecutionDetails: [{}] }),
    });

    const endpoint = `${okapi.url}/change-manager/jobExecutions`;
    const data = await deleteJobExecutions(['test-id'], okapi);

    expect(global.fetch.mock.calls[0][0]).toBe(endpoint);
    expect(data).toEqual({ jobExecutionDetails: [{}] });
  });

  it('when there is an error, returns an empty object', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      json: async () => ({}),
    });

    await deleteJobExecutions(['test-id'], okapi);

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0].message).toBe('Cannot delete jobExecutions');

    // eslint-disable-next-line no-console
    console.error.mockReset();
  });
});
