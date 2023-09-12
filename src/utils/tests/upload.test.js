import '../../../test/jest/__mock__';

import {
  createUploadDefinition,
  deleteFile,
  deleteUploadDefinition,
  getLatestUploadDefinition,
  mapFilesToUI,
} from '../upload';

jest.mock('@folio/stripes-data-transfer-components');

global.fetch = jest.fn();

describe('createUploadDefinition function', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('creates upload definition data sets', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        errors: [],
        id: 'uploadDefinitionId',
      }),
    });

    const files = [{
      size: 2048,
      name: 'file1',
    }, {
      size: 1024,
      name: 'file2',
    }];
    const url = 'https://api.com/uploadDefinitons/';
    const okapi = {};

    const data = await createUploadDefinition({
      files,
      url,
      okapi,
    });

    expect(global.fetch.mock.calls[0][0]).toBe(url);
    expect(data).toEqual([null, {
      id: 'uploadDefinitionId',
      errors: [],
    }]);
  });

  it('when there is api errors, returns appropriate value', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ errors: [new Error('Api error')] }),
    });

    const files = [{
      size: 2048,
      name: 'file1',
    }, {
      size: 1024,
      name: 'file2',
    }];
    const url = 'https://api.com/uploadDefinitons/';
    const okapi = {};

    const data = await createUploadDefinition({
      files,
      url,
      okapi,
    });

    expect(data[0]).toBe('Api error');
  });

  it('when there is fetch error, throws response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({}),
    });

    const files = [{
      size: 2048,
      name: 'file1',
    }, {
      size: 1024,
      name: 'file2',
    }];
    const url = 'https://api.com/uploadDefinitons/';
    const okapi = {};

    try {
      await createUploadDefinition({
        files,
        url,
        okapi,
      });
    } catch (e) {
      expect(e.ok).toBeFalsy();
      expect(e.status).toBe(400);
    }
  });
});

describe('deleteFile function', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('fires file deletion request', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ msg: 'success' }),
    });

    const url = 'https://api.com/files';
    const headers = { Authorization: 'Basic token' };

    const res = await deleteFile(url, headers);

    expect(global.fetch.mock.calls[0][0]).toBe(url);
    expect(res.ok).toBeTruthy();
    expect(await res.json()).toEqual({ msg: 'success' });
  });

  it('when there is error, throws response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const url = 'https://api.com/files';
    const headers = { Authorization: 'Basic token' };

    try {
      await deleteFile(url, headers);
    } catch (e) {
      expect(e.ok).toBeFalsy();
      expect(e.status).toBe(400);
    }
  });
});

describe('deleteUploadDefinition function', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('when there is error, throws response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const url = 'https://api.com/files';
    const headers = { Authorization: 'Basic token' };

    try {
      await deleteUploadDefinition({
        url,
        headers,
      });
    } catch (e) {
      expect(e.ok).toBeFalsy();
      expect(e.status).toBe(400);
    }
  });
});

describe('getLatestUploadDefinition function', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('when there is error, throws response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const url = 'https://api.com/files';
    const headers = { Authorization: 'Basic token' };

    try {
      await getLatestUploadDefinition({
        url,
        headers,
      });
    } catch (e) {
      expect(e.ok).toBeFalsy();
      expect(e.status).toBe(400);
    }
  });
});

describe('mapFilesToUI', () => {
  it('Given an undefined status value, and canUseObjectStorage: true, sets status to "UPLOADING-CANCELLABLE"', () => {
    const files = mapFilesToUI([{ name: 'testfile', lastModified: '202021122' }], true);
    expect(files['testfile202021122']).toHaveProperty('status', 'UPLOADING-CANCELLABLE');
  });

  it('Given an undefined status value, and canUseObjectStorage: false, sets status to "UPLOADING"', () => {
    const files = mapFilesToUI([{ name: 'testfile', lastModified: '202021122' }], false);
    expect(files['testfile202021122']).toHaveProperty('status', 'UPLOADING');
  });

  it('Given empty parameters, returns an empty object', () => {
    const files = mapFilesToUI();
    expect(files).toEqual({});
  });
});
