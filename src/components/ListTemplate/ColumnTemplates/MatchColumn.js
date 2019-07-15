import React, {
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';

import { IntlConsumer } from '@folio/stripes/core';

import {
  HTML_LANG_DIRECTIONS,
  STRING_CAPITALIZATION_EXCLUSIONS,
  STRING_CAPITALIZATION_MODES,
} from '../../../utils/constants';
import { capitalize } from '../../../utils';

import { RECORD_TYPES } from '../recordTypes';

import sharedCss from '../../../shared.css';

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

  const fieldSource = (field || existingRecordType || '').replace(/_/g, ' ');
  const fieldMatched = (fieldMarc || fieldNonMarc || existingStaticValueType || '').replace(/_/g, ' ');

  return (
    <IntlConsumer>
      {intl => RECORD_TYPES[existingRecordType].icon({
        label: (
          <Fragment>
            {document.dir === HTML_LANG_DIRECTIONS.LEFT_TO_RIGHT && (
              <Fragment>
                <HighLight
                  search={searchTerm}
                  className={sharedCss.container}
                >
                  {intl.formatMessage({ id: RECORD_TYPES[existingRecordType].captionId })}
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
                  {intl.formatMessage({ id: RECORD_TYPES[existingRecordType].captionId })}
                </HighLight>
              </Fragment>
            )}
          </Fragment>
        ),
      })}
    </IntlConsumer>
  );
});

MatchColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
};
