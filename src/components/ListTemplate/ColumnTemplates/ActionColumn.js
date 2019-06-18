import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { IntlConsumer } from '@folio/stripes/core';

import { RECORD_TYPES } from '../recordTypes';
import { ACTION_TYPES } from '../actionTypes';

export const ActionColumn = memo(({ record }) => {
  const {
    action,
    folioRecord,
  } = record;

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
        const label = createLabel(intl);
        const actionIcon = ACTION_TYPES[action].icon({ label });
        const recordTypeIcon = RECORD_TYPES[folioRecord].icon({ label: actionIcon });

        return recordTypeIcon;
      }}
    </IntlConsumer>
  );
});

ActionColumn.propTypes = { record: PropTypes.shape.isRequired };
