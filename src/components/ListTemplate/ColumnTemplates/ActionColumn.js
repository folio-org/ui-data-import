import React, { memo } from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import { IntlConsumer } from '@folio/stripes/core';

import { RECORD_TYPES } from '../recordTypes';
import { ACTION_TYPES } from '../actionTypes';

import sharedCss from '../../../shared.css';

export const ActionColumn = memo(({
  record: {
    action,
    folioRecord,
  },
  searchTerm = '',
}) => {
  const createLabel = ({ formatMessage }) => {
    const actionString = formatMessage({ id: `ui-data-import.${action.toLowerCase()}` });
    /** Record type should be in lower case except "MARC" is always all-caps */
    const recordTypeString = formatMessage({ id: RECORD_TYPES[folioRecord].captionId })
      .toLowerCase()
      .replace('marc', 'MARC');

    return `${actionString} ${recordTypeString}`;
  };

  return (
    <IntlConsumer>
      {intl => {
        const label = (
          <HighLight
            search={searchTerm}
            className={sharedCss.container}
          >
            {createLabel(intl)}
          </HighLight>
        );
        const actionIcon = ACTION_TYPES[action].icon({ label });
        const recordTypeIcon = RECORD_TYPES[folioRecord].icon({ label: actionIcon });

        return recordTypeIcon;
      }}
    </IntlConsumer>
  );
});

ActionColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
};
