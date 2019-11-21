import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@folio/stripes/components';

import { stringToWords } from '../../utils';
import { listTemplate } from '..';

import sharedCss from '../../shared.css';

export const associatedProfilesColumns = ({
  entityKey,
  searchTerm,
  selectRecord,
  selectedRecords,
  isMultiSelect,
}) => {
  const formatter = listTemplate({
    entityKey,
    searchTerm,
    selectRecord,
    selectedRecords,
  });
  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');

  if (!isMultiSelect) return { ...formatter };

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

associatedProfilesColumns.propTypes = {
  entityKey: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectRecord: PropTypes.func.isRequired,
  selectedRecords: PropTypes.instanceOf(Set).isRequired,
  isMultiSelect: PropTypes.bool,
};
