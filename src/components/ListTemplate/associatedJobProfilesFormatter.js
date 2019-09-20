import React from 'react';

import { Button } from '@folio/stripes/components';

import { listTemplate } from '.';
import { ENTITY_KEYS } from '../../utils/constants';

import sharedCss from '../../shared.css';

export const createAssociatedJobProfilesFormatter = ({
  searchTerm,
  selectRecord,
  selectedRecords,
}) => {
  const formatter = listTemplate({
    entityKey: ENTITY_KEYS.JOB_PROFILES,
    searchTerm,
    selectRecord,
    selectedRecords,
  });

  return {
    ...formatter,
    name: record => (
      <Button
        data-test-job-profile-link
        buttonStyle="link"
        marginBottom0
        to={`/settings/data-import/job-profiles/view/${record.id}`}
        buttonClass={sharedCss.cellLink}
      >
        {formatter.name(record)}
      </Button>
    ),
  };
};
