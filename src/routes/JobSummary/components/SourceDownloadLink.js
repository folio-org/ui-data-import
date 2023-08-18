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

import { useOkapiKy } from '@folio/stripes-core';

import { getObjectStorageDownloadURL } from '../../../utils';

export const SourceDownloadLink = ({
  fileName,
  executionId
}) => {
  const [downloadUrl, setDownloadURL] = useState(null);
  const ky = useOkapiKy();

  useEffect(() => {
    const requestDownloadUrl = () => {
      // const { url } = await getObjectStorageDownloadURL(ky, executionId);
      return 'blahblahblah';
    };
    setDownloadURL(requestDownloadUrl());
  }, [ky, executionId]);

  if (downloadUrl === null) {
    return (
      <Loading />
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
