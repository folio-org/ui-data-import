import React from 'react';

import {
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { trimLeadNumbers } from './multipartUpload';

export const fileNameCellFormatter = (record, location, shouldTrimNumbers = true) => {
  const { pathname, search } = location;

  const linkText = shouldTrimNumbers ? trimLeadNumbers(record.fileName) : record.fileName;

  return (
    <TextLink
      to={{
        pathname: `/data-import/job-summary/${record.id}`,
        state: { from: `${pathname}${search}` },
      }}
    >
      {record.fileName ? linkText : <NoValue />}
    </TextLink>
  );
};
