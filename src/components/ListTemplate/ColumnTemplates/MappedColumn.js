import React, {
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';

import { FOLIO_RECORD_TYPES } from '../folioRecordTypes';

import sharedCss from '../../../shared.css';

export const MappedColumn = memo(({
  record: { folioRecord },
  searchTerm = '',
}) => (
  <Fragment>
    {folioRecord && (
      <IntlConsumer>
        {({ formatMessage }) => (
          <AppIcon
            size="small"
            app="data-import"
            iconKey={FOLIO_RECORD_TYPES[folioRecord].iconKey}
          >
            <HighLight
              search={searchTerm}
              className={sharedCss.container}
            >
              {formatMessage({ id: FOLIO_RECORD_TYPES[folioRecord].captionId })}
            </HighLight>
          </AppIcon>
        )}
      </IntlConsumer>
    )}
  </Fragment>
));

MappedColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
};
