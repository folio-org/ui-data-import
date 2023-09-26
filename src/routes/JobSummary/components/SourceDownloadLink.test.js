import React from 'react';
import {
  renderWithIntl,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { SourceDownloadLink } from './SourceDownloadLink';
import '../../../utils/multipartUpload';

const mockResponse = jest.fn();
const mocklinkMethod = jest.fn(() => Promise.resolve(mockResponse()));
jest.mock('../../../utils/multipartUpload', () => ({
  ...jest.requireActual('../../../utils/multipartUpload'),
  getObjectStorageDownloadURL: mocklinkMethod
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  TextLink: ({ children, href }) => <a href={href}>{children}</a>,
  Loading: () => <>Loading</>
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: () => ({}),
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

  it('renders a loading spinner..', async () => {
    mockResponse.mockResolvedValue({ url: 'testUrl' });
    const { getByText } = await renderSourceDownloadLink({});

    expect(getByText('Loading')).toBeInTheDocument();
  });

  it('renders the filename in the link', async () => {
    mockResponse.mockResolvedValue({ url: 'testUrl' });
    const { findByText } = await renderSourceDownloadLink({});

    const text = await findByText('testFilename');
    expect(text).toBeDefined();
  });

  it('renders the provided url to the link href', async () => {
    mockResponse.mockResolvedValue({ url: 'http://www.testUrl' });
    const { findByRole } = await renderSourceDownloadLink({});

    const link = await findByRole('link');
    expect(link.href).toBe('http://www.testurl/');
  });

  it('renders unavailable message if the url is unavailable', async () => {
    mockResponse.mockResolvedValue('Not found');
    mocklinkMethod.mockRejectedValue(new Error({ message: '404' }));
    const { findByText } = await renderSourceDownloadLink({});
    const message = await findByText('Unavailable');
    expect(message).toBeInTheDocument();
  });
});
