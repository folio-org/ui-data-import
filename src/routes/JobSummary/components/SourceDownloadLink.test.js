import React from 'react';
import {
  waitFor,
  act,
} from '@testing-library/react';
import {
  renderWithIntl,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { SourceDownloadLink } from './SourceDownloadLink';
import '../../../utils/multipartUpload';

const mockResponse = jest.fn()
jest.mock('../../../utils/multipartUpload', () => ({
  ...jest.requireActual('../../../utils/multipartUpload'),
  getObjectStorageDownloadURL: () => Promise.resolve(mockResponse())
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  TextLink: ({children, href}) => <a href={href}>{children}</a>,
  Loading: () => <>Loading</>
}));

const renderSourceDownloadLink = ({id = 'testId', fileName= 'testFilename'}) => {
  return renderWithIntl(<SourceDownloadLink executionId={id} fileName={fileName} />);
}

describe('SourceDownloadLinkComponent', () => {
  beforeEach(() => {
    mockResponse.mockClear();
  });

  it('renders a loading spinner..', async () => {
    mockResponse.mockResolvedValue({ url: 'testUrl'});
    const { getByText } = await renderSourceDownloadLink({});

    expect(getByText('Loading')).toBeInTheDocument();
  });

  it('renders the filename in the link', async () => {
    mockResponse.mockResolvedValue({ url: 'testUrl'});
    const { findByText } = await renderSourceDownloadLink({});

    const text = await findByText('testFilename');
    expect(text).toBeDefined();
  });

  it('renders the provided url to the link href', async () => {
    mockResponse.mockResolvedValue({ url: 'http://www.testUrl'});
    const { findByRole } = await renderSourceDownloadLink({});

    const link = await findByRole('link');
    expect(link.href).toBe('http://www.testurl/');
  })
});