import { waitFor } from '@testing-library/react';
import '../../../test/jest/__mock__';

import {
  getStorageConfiguration,
  requestConfiguration,
  cancelMultipartJob,
  cancelMultipartJobEndpoint,
  MultipartUploader,
  initMPUploadEndpoint,
  requestPartUploadURL,
  getDownloadLinkURL,
  getObjectStorageDownloadURL,
  getFinishUploadEndpoint,
  trimLeadNumbers,
} from '../multipartUpload';

const testId = 'testId';
const responseMock = jest.fn();
const getMock = jest.fn((url) => {
  if (url === initMPUploadEndpoint) {
    return {
      json: () => { return Promise.resolve({ url: 'testUrl', uploadId: testId, key: 'testKey' }); }
    };
  }
  if (url === requestPartUploadURL) {
    return {
      json: () => { return Promise.resolve({ url: 'testSubsequentUrl', key: 'testSubsequentKey' }); }
    };
  }
  if (url.startsWith(getFinishUploadEndpoint(testId, 'undefined'))) {
    return {
      json: () => { return Promise.resolve({ ok: true }); }
    };
  }
  if (url.startsWith(cancelMultipartJobEndpoint(testId))) {
    return {
      json: () => { return Promise.resolve({ ok: true }); }
    };
  }
  return { json: () => {
    return Promise.resolve(responseMock());
  } };
});

const kyMock = {
  get: getMock,
  post: getMock,
  delete: getMock,
};
const mockFetch = jest.fn(() => Promise.resolve({ ok: true }));

global.fetch = mockFetch;
const mockXMLHttpRequest = () => {
  const mock = {
    open: jest.fn(),
    addEventListener: jest.fn(),
    setRequestHeader: jest.fn(),
    send: jest.fn(),
    getResponseHeader: jest.fn(() => 'testEtag'),
    status: 200,
    upload: {
      addEventListener: jest.fn(),
    },
    abort: jest.fn(),
  };

  window.XMLHttpRequest = jest.fn(() => mock);
  return mock;
};


function getFileOfSize(sizeBytes) {
  return new Blob([new ArrayBuffer(sizeBytes)]);
}

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
    mockFetch.mockClear();
  });

  it('calls fetch with correct parameters', () => {
    cancelMultipartJob(kyMock, testId);
    expect(kyMock.delete).toBeCalledWith(cancelMultipartJobEndpoint(testId));
  });
});

describe('getObjectStorageDownloadURL function', () => {
  afterEach(() => {
    getMock.mockClear();
  });

  it('calls ky get with correct parameters', async () => {
    getObjectStorageDownloadURL(kyMock, testId);
    expect(kyMock.get).toBeCalledWith(getDownloadLinkURL(testId));
  });
});

describe('trimLeadNumbers function', () => {
  it('removes leading digits from string', () => {
    expect(trimLeadNumbers('1930490-test')).toBe('test');
  });

  it('returns original for strings without lead numbers', () => {
    expect(trimLeadNumbers('test')).toBe('test');
  });
});

describe('MultipartUploader class', () => {
  let mockXHR;
  let uploader;
  const errorHandler = jest.fn((fileKey, error) => console.log(error));
  const progressHandler = jest.fn();
  const successHandler = jest.fn();
  const createMultipartUploader = (size = 31457280) => new MultipartUploader(
    testId,
    { file1: {
      file: getFileOfSize(size),
      size
    } },
    kyMock,
    errorHandler,
    progressHandler,
    successHandler,
    { formatMessage: jest.fn() }
  );

  beforeEach(() => {
    mockXHR = mockXMLHttpRequest();
  });

  afterEach(() => {
    uploader = null;
    errorHandler.mockClear();
    progressHandler.mockClear();
    successHandler.mockClear();
  });

  it('executes upload with init()', async () => {
    uploader = createMultipartUploader();
    uploader.init();
    await waitFor(() => expect(mockXHR.addEventListener).toHaveBeenCalled());
    const progress = mockXHR.upload.addEventListener.mock.calls[0][1];
    progress({ loaded: 12, total: 100 });
    expect(progressHandler).toHaveBeenCalled();
    mockXHR.status = 200;
    progress({ loaded: 100, total: 100 });
    expect(progressHandler).toHaveBeenCalledTimes(2);
    const readystatechange = mockXHR.addEventListener.mock.calls[0][1];
    readystatechange();
    await waitFor(() => expect(successHandler).toBeCalled());
    expect(mockXHR.open).toHaveBeenCalled();
    expect(mockXHR.send).toHaveBeenCalled();
    await waitFor(() => expect(errorHandler).toHaveBeenCalledTimes(0));
  });

  it('handles larger files, multiple slices (2 slices expected)', async () => {
    let readystatechange;
    uploader = createMultipartUploader(51457280);
    uploader.init();
    await waitFor(() => expect(mockXHR.addEventListener).toHaveBeenCalled());
    readystatechange = mockXHR.addEventListener.mock.calls[0][1];
    mockXHR.status = 200;
    readystatechange();
    await waitFor(() => expect(mockXHR.send).toHaveBeenCalledTimes(2));
    readystatechange = mockXHR.addEventListener.mock.calls[2][1];
    readystatechange();
    await waitFor(() => expect(successHandler).toBeCalled());
    await waitFor(() => expect(errorHandler).toHaveBeenCalledTimes(0));
  });

  it('cancelation', async () => {
    let readystatechange;
    uploader = createMultipartUploader(51457280);
    uploader.init();
    await waitFor(() => expect(mockXHR.addEventListener).toHaveBeenCalled());
    readystatechange = mockXHR.addEventListener.mock.calls[0][1];
    mockXHR.status = 200;
    readystatechange();
    mockXHR.status = 0;
    await waitFor(() => expect(mockXHR.open).toHaveBeenCalledTimes(2));
    readystatechange = mockXHR.addEventListener.mock.calls[2][1];
    uploader.abort();
    const abort = mockXHR.upload.addEventListener.mock.calls[3][1];
    abort();
    readystatechange();
    expect(uploader.abortSignal).toBe(true);
    await waitFor(() => expect(successHandler).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(errorHandler).toHaveBeenCalledTimes(0));
  });

  it('error handler', async () => {
    let readystatechange;
    uploader = createMultipartUploader(51457280);
    uploader.init();
    await waitFor(() => expect(mockXHR.addEventListener).toHaveBeenCalled());
    readystatechange = mockXHR.addEventListener.mock.calls[0][1];
    mockXHR.status = 200;
    readystatechange();
    mockXHR.status = 500;
    mockXHR.responseText = JSON.stringify({ message: 'there was a problem!' });
    await waitFor(() => expect(mockXHR.open).toHaveBeenCalledTimes(2));
    readystatechange = mockXHR.addEventListener.mock.calls[2][1];
    readystatechange();
    expect(uploader.abortSignal).toBe(false);
    await waitFor(() => expect(successHandler).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(errorHandler).toHaveBeenCalledTimes(1));
  });
});
