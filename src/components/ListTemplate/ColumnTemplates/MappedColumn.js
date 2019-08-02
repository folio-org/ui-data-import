import React, { memo } from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import { IntlConsumer } from '@folio/stripes/core';

import { RECORD_TYPES } from '../recordTypes';

import sharedCss from '../../../shared.css';

export const MappedColumn = memo(({
  record: { folioRecord },
  searchTerm = '',
}) => (
  <IntlConsumer>
    {({ formatMessage }) => {
      const label = (
        <HighLight
          search={searchTerm}
          className={sharedCss.container}
        >
          {formatMessage({ id: RECORD_TYPES[folioRecord].captionId })}
        </HighLight>
      );

      return RECORD_TYPES[folioRecord].icon({ label });
    }}
  </IntlConsumer>
));

MappedColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
};
