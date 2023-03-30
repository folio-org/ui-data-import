import React from 'react';

import { TextLink } from '@folio/stripes/components';

export const jobProfileNameCellFormatter = record => {
  const { jobProfileInfo: { id, name } } = record;
  const linkToJobProfile = `/settings/data-import/job-profiles/view/${id}`;

  return <TextLink to={linkToJobProfile}>{name}</TextLink>;
};
