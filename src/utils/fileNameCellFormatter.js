import React from 'react';

import {
  NoValue,
  TextLink,
} from '@folio/stripes/components';

export const fileNameCellFormatter = (record, location) => {
  const { pathname, search } = location;

  return (
    <TextLink
      to={{
        pathname: `/data-import/job-summary/${record.id}`,
        state: { from: `${pathname}${search}` },
      }}
    >
      {record.fileName || <NoValue /> }
    </TextLink>
  );
};
