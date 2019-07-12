import React, { memo } from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import { RECORD_TYPES } from '../recordTypes';

import sharedCss from '../../../shared.css';

export const MappedColumn = memo(({
  record: { mapped },
  searchTerm,
}) => {
  const recordType = Object.keys(RECORD_TYPES)
    .find(item => mapped.toUpperCase().includes(item));

  const label = (
    <HighLight
      search={searchTerm}
      className={sharedCss.container}
    >
      {mapped}
    </HighLight>
  );

  return RECORD_TYPES[recordType].icon({ label });
});

MappedColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string.isRequired,
};
