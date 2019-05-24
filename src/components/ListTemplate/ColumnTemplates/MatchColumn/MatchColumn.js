import React, {
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import {
  AppIcon,
  IntlConsumer,
} from '@folio/stripes/core';

import {
  ENTITY_CONFIGS,
  HTML_LANG_DIRECTIONS,
  STRING_CAPITALIZATION_EXCLUSIONS,
  STRING_CAPITALIZATION_MODES,
} from '../../../../utils/constants';
import { capitalize } from '../../../../utils';

import sharedCss from '../../../../shared.css';

export const MatchColumn = memo(props => {
  const {
    record,
    searchTerm,
  } = props;
  const {
    existingRecordType,
    existingStaticValueType,
    field,
    fieldMarc,
    fieldNonMarc,
  } = record;
  const { RECORD_TYPES } = ENTITY_CONFIGS.MATCH_PROFILES;

  const fieldSource = (field || existingRecordType || '').replace(/_/g, ' ');
  const fieldMatched = (fieldMarc || fieldNonMarc || existingStaticValueType || '').replace(/_/g, ' ');

  return (
    <IntlConsumer>
      {intl => (
        <AppIcon
          size="small"
          app="data-import"
          iconKey={RECORD_TYPES[existingRecordType].icon}
          className={sharedCss.cellAppIcon}
        >
          {document.dir === HTML_LANG_DIRECTIONS.LEFT_TO_RIGHT && (
            <Fragment>
              <HighLight
                search={searchTerm}
                className={sharedCss.container}
              >
                {intl.formatMessage({ id: RECORD_TYPES[existingRecordType].caption })}
              </HighLight>
              &nbsp;&middot;&nbsp;
              <HighLight
                search={searchTerm}
                className={sharedCss.container}
              >
                {capitalize(fieldSource, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS)}
              </HighLight>
              &nbsp;&rarr;&nbsp;
              <HighLight
                search={searchTerm}
                className={sharedCss.container}
              >
                {capitalize(fieldMatched, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS)}
              </HighLight>
            </Fragment>
          )}
          {document.dir === HTML_LANG_DIRECTIONS.RIGHT_TO_LEFT && (
            <Fragment>
              <HighLight
                search={searchTerm}
                className={sharedCss.container}
              >
                {capitalize(fieldMatched, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS)}
              </HighLight>
              &nbsp;&larr;&nbsp;
              <HighLight
                search={searchTerm}
                className={sharedCss.container}
              >
                {capitalize(fieldSource, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS)}
              </HighLight>
              &nbsp;&middot;&nbsp;
              <HighLight
                search={searchTerm}
                className={sharedCss.container}
              >
                {intl.formatMessage({ id: RECORD_TYPES[existingRecordType].caption })}
              </HighLight>
            </Fragment>
          )}
        </AppIcon>
      )}
    </IntlConsumer>
  );
});

MatchColumn.propTypes = {
  record: PropTypes.shape.isRequired,
  searchTerm: PropTypes.string.isRequired,
};
