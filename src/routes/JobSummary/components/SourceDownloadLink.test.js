import React, { act } from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import { renderWithIntl } from '../../../../test/jest/helpers';

import { SourceDownloadLink } from './SourceDownloadLink';
import '../../../utils/multipartUpload';

// the indirectly used ky library extends JS Errors with JS mockHTTPError.
// this is used to simulate how we handle a 404 response.
class MockHTTPError extends Error {
  constructor(response) {
    super(
      response.status
    );
    this.name = 'HTTPError';
    this.response = response;
  }
}

const mockResponse = jest.fn();
jest.mock('../../../utils/multipartUpload', () => ({
  ...jest.requireActual('../../../utils/multipartUpload'),
  getObjectStorageDownloadURL: (ky, id) => {
    if (id === 'file-removed') {
      throw (new MockHTTPError({ status: '404' }));
    }
    return Promise.resolve(mockResponse());
  }
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  TextLink: ({ children, href }) => <a href={href}>{children}</a>,
  Loading: () => <>Loading</>
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(() => {}),
  useCallout: jest.fn(() => ({
    sendCallout: jest.fn(() => {})
  })),
}));

const renderSourceDownloadLink = ({ id = 'testId', fileName = 'testFilename' }) => {
  return renderWithIntl(<SourceDownloadLink executionId={id} fileName={fileName} />);
};

describe('SourceDownloadLinkComponent', () => {
  beforeEach(() => {
    mockResponse.mockClear();
  });

  it('renders a loading spinner', async () => {
    mockResponse.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ url: 'testUrl' }), 0)));

    await act(async () => {
      renderSourceDownloadLink({ id: 'testId1' });
    });

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders the filename in the link', async () => {
    mockResponse.mockResolvedValue({ url: 'testUrl' });
    const { findByText } = await act(async () => renderSourceDownloadLink({ id:'testId2' }));

    const text = await findByText('testFilename');
    expect(text).toBeDefined();
  });

  it('renders the provided url to the link href', async () => {
    mockResponse.mockResolvedValue({ url: 'http://www.testUrl' });
    const { findByRole } = await act(async () => renderSourceDownloadLink({ id:'testId3' }));

    const link = await findByRole('link');
    expect(link.href).toBe('http://www.testurl/');
  });

  it('renders unavailable message if the url is unavailable', async () => {
    mockResponse.mockResolvedValue('Not found');
    const { findByText } = await act(async () => renderSourceDownloadLink({ id:'file-removed' }));
    const message = await findByText('Unavailable');
    expect(message).toBeInTheDocument();
  });
});
