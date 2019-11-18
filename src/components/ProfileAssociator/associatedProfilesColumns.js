import React from 'react';

import { Button } from '@folio/stripes/components';

import { stringToWords } from '../../utils';
import { listTemplate } from '..';

import sharedCss from '../../shared.css';

export const associatedProfilesColumns = ({
  entityKey,
  searchTerm,
  selectRecord,
  selectedRecords,
}) => {
  const formatter = listTemplate({
    entityKey,
    searchTerm,
    selectRecord,
    selectedRecords,
  });
  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');

  return {
    ...formatter,
    name: record => (
      <Button
        data-test-job-profile-link
        buttonStyle="link"
        marginBottom0
        to={`/settings/data-import/${entityName}/view/${record.id}`}
        buttonClass={sharedCss.cellLink}
      >
        {formatter.name(record)}
      </Button>
    ),
  };
};
