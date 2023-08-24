import '../../../test/jest/__mock__';

import {
  getStorageConfiguration,
  requestConfiguration,
  cancelMultipartJob,
  cancelMultipartJobEndpoint
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
