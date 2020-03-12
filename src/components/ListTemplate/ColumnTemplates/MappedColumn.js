import React, { memo } from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';

import { FOLIO_RECORD_TYPES } from '../folioRecordTypes';

import sharedCss from '../../../shared.css';

export const MappedColumn = memo(({
  record,
  searchTerm = '',
}) => {
  if (!record) {
    return <span>-</span>;
  }

  const { existingRecordType } = record;

  if (!existingRecordType) {
    return <span>-</span>;
  }

  return (
    <>
      {existingRecordType && (
        <IntlConsumer>
          {({ formatMessage }) => (
            <AppIcon
              size="small"
              app="data-import"
              iconKey={FOLIO_RECORD_TYPES[existingRecordType].iconKey}
            >
              <HighLight
                search={searchTerm || ''}
                className={sharedCss.container}
              >
                {formatMessage({ id: FOLIO_RECORD_TYPES[existingRecordType].captionId })}
              </HighLight>
            </AppIcon>
          )}
        </IntlConsumer>
      )}
    </>
  );
});

MappedColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
};
