import '../../../test/jest/__mock__';

import {
  getStorageConfiguration,
  requestConfiguration,
  cancelMultipartJob,
  cancelMultipartJobEndpoint,
  getUpdateUploadDefinitionForObjectStorage
} from '../multipartUpload';

const responseMock = jest.fn();
const getMock = jest.fn(() => ({
  json: () => {
    return Promise.resolve(responseMock());
  },
}));

const kyMock = {
  get: getMock
};
const mockFetch = jest.fn(() => Promise.resolve({ ok: true }));
global.fetch = mockFetch;

describe('getStorageConfiguration function', () => {
  afterEach(() => {
    getMock.mockClear();
  });

  it('calls provided handler with correct parameter', async () => {
    const mockedStatus = { splitStatus: true };
    responseMock.mockResolvedValue(mockedStatus);
    const response = await getStorageConfiguration(kyMock);
    expect(getMock).toBeCalledWith(requestConfiguration);
    expect(response).toBe(mockedStatus);
  });
});

describe('cancelMultipartUpload function', () => {
  afterEach(() => {
    getMock.mockClear();
  });

  it('calls fetch with correct parameters', async () => {
    cancelMultipartJob('testid', 'test-header');
    expect(mockFetch).toBeCalledWith(cancelMultipartJobEndpoint('testid'), { headers: 'test-header', method: 'POST' });
  });
});

describe('getUpdateUploadDefinitionForObjectStorage function', () => {
  const uploadDefinition = {
    fileDefinitions: [
      {
        uiKey: 'test1',
        name: 'test1filename.mrc'
      },
      {
        uiKey: 'test2',
        name: 'test2filename.mrc'
      },
    ]
  };

  const expectedUploadDefinition = {
    fileDefinitions: [
      {
        uiKey: 'test1',
        name: 'test1filename.mrc'
      },
      {
        uiKey: 'test2',
        name: 'diku/test2filename.mrc'
      },
    ]
  };
  it('modifies appropriate file definition as expected', async () => {
    expect(getUpdateUploadDefinitionForObjectStorage(uploadDefinition, 'test2', 'diku/test2filename.mrc')).toEqual(expectedUploadDefinition);
  });
  it('returns original configuration if file definition can\'t be matched', async () => {
    expect(getUpdateUploadDefinitionForObjectStorage(uploadDefinition, 'test3', 'diku/test2filename.mrc')).toEqual(uploadDefinition);
  });
});
