import faker from 'faker';
import {
  fetchJsonSchema,
  getModuleVersion,
  handleAllRequests,
} from '../fetchJsonShemas';

describe('getModuleVersion function', () => {
  it('returns module version of a module with given name', () => {
    const testModules = [{
      name: 'module1',
      id: 'testId1',
    }, {
      name: 'module2',
      id: 'testId2',
    }];

    expect(getModuleVersion(testModules, 'module2')).toBe(testModules[1].id);
    expect(getModuleVersion(testModules, 'module3')).toBeUndefined();
  });
});

global.fetch = jest.fn();

const getRandomId = faker.random.uuid;

describe('fetchJsonSchema function', () => {
  it('fetches correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ properties: 'testSchema' }),
    });
    const path = 'testRecord.json';
    const module = getRandomId();
    const okapi = {
      url: 'https://test.com',
      tenant: 'tenant',
      token: 'token',
    };
    const expected = `${okapi.url}/_/jsonSchemas?path=${path}`;
    const data = await fetchJsonSchema(path, module, okapi);

    expect(global.fetch.mock.calls[0][0]).toBe(expected);
    expect(data).toEqual({ properties: 'testSchema' });
  });

  it('when there is an error, returns empty object', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {},
    });
    const path = 'testRecord.json';
    const module = getRandomId();
    const okapi = {
      url: 'https://test.com',
      tenant: 'tenant',
      token: 'token',
    };
    const expected = `Cannot fetch resources from "${path}"`;
    const data = await fetchJsonSchema(path, module, okapi);

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0].message).toBe(expected);
    expect(data).toEqual({});

    // eslint-disable-next-line no-console
    console.error.mockReset();
  });
});

describe('handleAllRequests function', () => {
  it('handles successful requests correctly', async () => {
    const requests = [Promise.resolve({ properties: 'success1' }), Promise.resolve({ properties: 'success2' })];
    const requestTo = 'testRecord';
    const callback = jest.fn();

    await handleAllRequests(requests, requestTo, callback);

    expect(callback).toHaveBeenCalledWith(['success1', 'success2'], requestTo);
  });

  it('handles error correctly', async () => {
    const requests = [Promise.resolve({ properties: 'success1' }), Promise.reject(new Error('async error'))];
    const requestTo = 'testRecord';
    const callback = jest.fn();

    await handleAllRequests(requests, requestTo, callback);

    expect(callback).toHaveBeenCalledWith({}, requestTo);
  });
});
