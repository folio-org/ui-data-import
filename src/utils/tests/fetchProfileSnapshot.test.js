import faker from 'faker';

import '../../../test/jest/__mock__';

import { fetchProfileSnapshot } from '../fetchProfileSnapshot';
import {
  ASSOCIATION_TYPES,
  STATUS_CODES,
} from '../constants';

global.fetch = jest.fn();

const getRandomId = faker.random.uuid;

describe('fetchProfileSnapshot function', () => {
  it('fetches correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({ id: 'snapshotId' }),
    });

    const profileId = getRandomId();
    const profileType = ASSOCIATION_TYPES.actionProfiles;
    const jobProfileId = getRandomId();
    const okapi = {
      url: 'https://test.com',
      tenant: 'tenant',
      token: 'token',
    };
    const expected = `${okapi.url}/data-import-profiles/profileSnapshots/${profileId}?profileType=${profileType}&jobProfileId=${jobProfileId}`;
    const data = await fetchProfileSnapshot(profileId, profileType, jobProfileId, okapi);

    expect(global.fetch.mock.calls[0][0]).toBe(expected);
    expect(data).toEqual({ id: 'snapshotId' });
  });

  it('when there is an error, returns an empty object', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      json: async () => ({}),
    });

    const profileId = getRandomId();
    const profileType = ASSOCIATION_TYPES.actionProfiles;
    const jobProfileId = getRandomId();
    const okapi = {
      url: 'https://test.com',
      tenant: 'tenant',
      token: 'token',
    };

    const data = await fetchProfileSnapshot(profileId, profileType, jobProfileId, okapi);

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0].message).toBe('Cannot fetch profile snapshot');
    expect(data).toEqual({});

    // eslint-disable-next-line no-console
    console.error.mockReset();
  });
});
