import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  FormattedMessage
} from 'react-intl';

import {
  Layout,
  TextLink,
  Loading
} from '@folio/stripes/components';

import { useOkapiKy, useCallout } from '@folio/stripes/core';

import { getObjectStorageDownloadURL } from '../../../utils/multipartUpload';

export const SourceDownloadLink = ({
  fileName,
  executionId
}) => {
  const [downloadUrl, setDownloadURL] = useState(null);
  const ky = useOkapiKy();
  const callout = useCallout();

  // Request the download link in onmount, hence the empty dependency array.
  useEffect(() => {
    const requestDownloadUrl = async () => {
      try {
        const { url } = await getObjectStorageDownloadURL(ky, executionId);
        if (url) {
          setDownloadURL(url);
        }
      } catch (err) {
        callout.sendCallout({
          message: (
            <FormattedMessage
              id="ui-data-import.downloadLinkRequestError"
            />
          ),
          type: 'error',
          timeout: 0,
        });
      }
    };
    if (downloadUrl === null) {
      requestDownloadUrl();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (downloadUrl === null) {
    return (
      <Layout className="padding-all-gutter flex centerContent">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout className="padding-all-gutter flex centerContent">
      <div>
        <strong>
          <FormattedMessage
            id="ui-data-import.jobSummarySourceFileLabel"
          />
        </strong>
        <TextLink href={downloadUrl}>
          {fileName}
        </TextLink>
      </div>
    </Layout>
  );
};

SourceDownloadLink.propTypes = {
  fileName: PropTypes.string.isRequired,
  executionId: PropTypes.string.isRequired,
};
