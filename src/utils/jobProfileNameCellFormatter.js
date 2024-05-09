import React from 'react';

import {
  NoValue,
  TextLink,
} from '@folio/stripes/components';

export const jobProfileNameCellFormatter = record => {
  if (!record.jobProfileInfo) {
    return <NoValue />;
  }

  const { jobProfileInfo: { id, name } } = record;
  const linkToJobProfile = `/settings/data-import/job-profiles/view/${id}`;

  return <TextLink to={linkToJobProfile}>{name}</TextLink>;
};
