import React from 'react';

import {
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { trimLeadNumbers } from './multipartUpload';

export const fileNameCellFormatter = (record, location, shouldTrimNumbers) => {
  const { pathname, search } = location;

  return (
    <TextLink
      to={{
        pathname: `/data-import/job-summary/${record.id}`,
        state: { from: `${pathname}${search}` },
      }}
    >
      {record.fileName ? (shouldTrimNumbers ? trimLeadNumbers(record.fileName) : record.fileName) : <NoValue />}
    </TextLink>
  );
};
