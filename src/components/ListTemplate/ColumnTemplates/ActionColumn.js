import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';

import { Highlight } from '../../Highlight';

import { FOLIO_RECORD_TYPES } from '../folioRecordTypes';
import { ACTION_TYPES } from '../actionTypes';

import sharedCss from '../../../shared.css';
import { ActionIcon } from '../ActionIcon';

export const createActionLabel = ({ formatMessage }, action, folioRecord) => {
  const actionString = formatMessage({ id: ACTION_TYPES[action].captionId });
  // record type should be in lower case except "MARC" is always all-caps
  const recordTypeString = formatMessage({ id: FOLIO_RECORD_TYPES[folioRecord].captionId })
    .toLowerCase()
    .replace('marc', 'MARC');

  return `${actionString} ${recordTypeString}`;
};

export const ActionColumn = memo(({
  record,
  searchTerm = '',
}) => {
  if (!record) {
    return <span>-</span>;
  }

  const {
    action,
    folioRecord,
  } = record;

  if (!action || !folioRecord) {
    return <span>-</span>;
  }

  return (
    <IntlConsumer>
      {intl => {
        const label = (
          <Highlight
            searchWords={[searchTerm || '']}
            text={createActionLabel(intl, action, folioRecord)}
            className={sharedCss.container}
          />
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
