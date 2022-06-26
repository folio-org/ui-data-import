import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';
import { Highlighter } from '@folio/stripes/components';

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
              <Highlighter
                search={searchTerm || ''}
                className={sharedCss.container}
              >
                {formatMessage({ id: FOLIO_RECORD_TYPES[existingRecordType].captionId })}
              </Highlighter>
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
