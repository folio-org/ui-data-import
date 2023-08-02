import '../../../test/jest/__mock__';

import {
  getStorageConfiguration,
  requestConfiguration
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
