import faker from 'faker';

import '../../../test/jest/__mock__';

import {
  fetchJobProfile,
  fetchUploadDefinition,
  loadRecords,
} from '../loadRecords';

global.fetch = jest.fn();

describe('fetchUploadDefinition function', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('fetches upload definition of profile with given id', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 'uploadDefinitionId' }),
    });

    const okapi = { url: 'https://test.com' };
    const id = faker.random.uuid();

    const data = await fetchUploadDefinition({
      okapi,
      id,
    });
    const expected = `${okapi.url}/data-import/uploadDefinitions/${id}`;

    expect(global.fetch.mock.calls[0][0]).toBe(expected);
    expect(data).toEqual({ id: 'uploadDefinitionId' });
  });

  it('when there is an error, throws response object', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const okapi = { url: 'https://test.com' };
    const id = faker.random.uuid();

    try {
      await fetchUploadDefinition({
        okapi,
        id,
      });
    } catch (e) {
      expect(e).toEqual({
        ok: false,
        status: 400,
      });
    }
  });
});

describe('fetchJobProfile function', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('fetches job profile with given id', () => {
    const okapi = { url: 'https://test.com' };
    const id = faker.random.uuid();

    fetchJobProfile({
      okapi,
      id,
    });
    const expected = `${okapi.url}/data-import-profiles/jobProfiles/${id}`;

    expect(global.fetch.mock.calls[0][0]).toBe(expected);
  });
});

describe('loadRecords function', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('loads records', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'testId' }),
    });

    const okapi = { url: 'https://test.com' };
    const uploadDefinitionId = faker.random.uuid();
    const jobProfileInfo = {
      id: faker.random.uuid(),
      name: 'testName',
      dataType: 'marc',
    };
    const defaultMapping = true;

    const data = await loadRecords({
      okapi,
      uploadDefinitionId,
      jobProfileInfo,
      defaultMapping,
    });
    const expected = `${okapi.url}/data-import/uploadDefinitions/${uploadDefinitionId}/processFiles?defaultMapping=${defaultMapping}`;

    expect(global.fetch.mock.calls[1][0]).toBe(expected);
    expect(data.status).toEqual(200);
    expect(data.ok).toBeTruthy();
    expect(await data.json()).toEqual({ id: 'testId' });
  });

  it('when there is an error, throws response object', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'uploadDefinitionId' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

    const okapi = { url: 'https://test.com' };
    const uploadDefinitionId = faker.random.uuid();
    const jobProfileInfo = {
      id: faker.random.uuid(),
      name: 'testName',
      dataType: 'marc',
    };
    const defaultMapping = true;

    try {
      await loadRecords({
        okapi,
        uploadDefinitionId,
        jobProfileInfo,
        defaultMapping,
      });
    } catch (e) {
      expect(e).toEqual({
        ok: false,
        status: 400,
      });
    }
  });
});
