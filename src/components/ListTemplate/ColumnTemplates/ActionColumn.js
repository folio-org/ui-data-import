import React, { memo } from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';

import { FOLIO_RECORD_TYPES } from '../folioRecordTypes';
import { ACTION_TYPES } from '../actionTypes';

import sharedCss from '../../../shared.css';
import { ActionIcon } from '../ActionIcon';

export const ActionColumn = memo(({
  record: {
    action,
    folioRecord,
  },
  searchTerm = '',
}) => {
  const createLabel = ({ formatMessage }) => {
    const actionString = formatMessage({ id: `ui-data-import.${action.toLowerCase()}` });
    // record type should be in lower case except "MARC" is always all-caps
    const recordTypeString = formatMessage({ id: FOLIO_RECORD_TYPES[folioRecord].captionId })
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
        const actionIcon = (
          <ActionIcon icon={ACTION_TYPES[action].iconKey}>
            {label}
          </ActionIcon>
        );

        return (
          <AppIcon
            size="small"
            app="data-import"
            iconKey={FOLIO_RECORD_TYPES[folioRecord].iconKey}
          >
            {actionIcon}
          </AppIcon>
        );
      }}
    </IntlConsumer>
  );
});

ActionColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
};
