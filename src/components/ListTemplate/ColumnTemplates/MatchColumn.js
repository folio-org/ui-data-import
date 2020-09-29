import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';
import { get } from 'lodash';

import { NoValue } from '@folio/stripes/components';
import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';

import {
  capitalize,
  getFieldMatched,
  HTML_LANG_DIRECTIONS,
  STRING_CAPITALIZATION_EXCLUSIONS,
  STRING_CAPITALIZATION_MODES,
} from '../../../utils';

import { FOLIO_RECORD_TYPES } from '../folioRecordTypes';

import sharedCss from '../../../shared.css';

export const MatchColumn = memo(({
  record,
  searchTerm,
  resources,
}) => {
  const intl = useIntl();

  if (!record) {
    return <span>-</span>;
  }

  const {
    existingRecordType,
    field,
  } = record;

  if (!field && !existingRecordType) {
    return <span>-</span>;
  }

  const fieldSource = (field || existingRecordType || '').replace(/_/g, ' ');
  const fields = get(record, 'matchDetails[0].existingMatchExpression.fields', []);

  return (
    <IntlConsumer>
      {({ formatMessage }) => (
        <AppIcon
          size="small"
          app="data-import"
          iconKey={FOLIO_RECORD_TYPES[existingRecordType].iconKey}
        >
          <>
            {document.dir === HTML_LANG_DIRECTIONS.LEFT_TO_RIGHT && (
              <>
                <HighLight
                  search={searchTerm || ''}
                  className={sharedCss.container}
                >
                  {formatMessage({ id: FOLIO_RECORD_TYPES[existingRecordType].captionId })}
                </HighLight>
                &nbsp;&middot;&nbsp;
                <HighLight
                  search={searchTerm || ''}
                  className={sharedCss.container}
                >
                  {capitalize(fieldSource, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS)}
                </HighLight>
                &nbsp;&rarr;&nbsp;
                <HighLight
                  search={searchTerm || ''}
                  className={sharedCss.container}
                >
                  {getFieldMatched(fields, fieldSource, resources, intl) || <NoValue />}
                </HighLight>
              </>
            )}
            {document.dir === HTML_LANG_DIRECTIONS.RIGHT_TO_LEFT && (
              <>
                <HighLight
                  search={searchTerm || ''}
                  className={sharedCss.container}
                >
                  {getFieldMatched(fields, fieldSource, resources, intl) || <NoValue />}
                </HighLight>
                &nbsp;&larr;&nbsp;
                <HighLight
                  search={searchTerm || ''}
                  className={sharedCss.container}
                >
                  {capitalize(fieldSource, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS)}
                </HighLight>
                &nbsp;&middot;&nbsp;
                <HighLight
                  search={searchTerm || ''}
                  className={sharedCss.container}
                >
                  {formatMessage({ id: FOLIO_RECORD_TYPES[existingRecordType].captionId })}
                </HighLight>
              </>
            )}
          </>
        </AppIcon>
      )}
    </IntlConsumer>
  );
});

MatchColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
  resources: PropTypes.object,
};
