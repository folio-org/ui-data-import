import React, { Fragment } from 'react';
import HighLight from 'react-highlighter';

import {
  AppIcon,
  IntlConsumer,
} from '@folio/stripes/core';
import { Checkbox } from '@folio/stripes/components';

import { capitalize } from '../../utils';
import {
  HTML_LANG_DIRECTIONS,
  ENTITY_CONFIGS,
  STRING_CAPITALIZATION_MODES,
  STRING_CAPITALIZATION_EXCLUSIONS,
} from '../../utils/constants';

import {
  TagsFormatter,
  DateFormatter,
  UserNameFormatter,
} from '../../components';

import sharedCss from '../../shared.css';

export const resultsFormatter = (searchTerm, selectRecord, selectedRecords) => ({
  selected: record => (
    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
      tabIndex="0"
      role="button"
      className={sharedCss.selectableCellButton}
      data-test-select-item
      onClick={e => e.stopPropagation()}
    >
      <Checkbox
        name={`selected-${record.id}`}
        checked={selectedRecords.has(record.id)}
        onChange={() => selectRecord(record.id)}
      />
    </div>
  ),
  name: record => (
    <AppIcon
      size="small"
      app="data-import"
      iconKey="matchProfiles"
      className={sharedCss.cellAppIcon}
    >
      <HighLight
        search={searchTerm}
        className={sharedCss.container}
      >
        {record.name}
      </HighLight>
    </AppIcon>
  ),
  match: record => {
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
  },
  tags: record => (
    <TagsFormatter
      record={record}
      searchTerm={searchTerm}
    />
  ),
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return <DateFormatter value={updatedDate} />;
  },
  updatedBy: record => <UserNameFormatter value={record.userInfo} />,
});
