import {
  React,
  Fragment,
} from 'react';
import HighLight from 'react-highlighter';
import {
  get,
  isEmpty,
} from 'lodash';

import { AppIcon } from '@folio/stripes/core';
import {
  Checkbox,
  Icon,
} from '@folio/stripes/components';

import { capitalize } from '../../utils';
import { ENTITY_CONFIGS, STRING_CAPITALIZATION_MODES } from '../../utils/constants';

import {
  DateFormatter,
  UserNameFormatter,
} from '../../components';

import sharedCss from '../../shared.css';
import css from './MatchProfiles.css';

export const resultsFormatter = searchTerm => ({
  selected: record => (
    <button
      type="button"
      className={sharedCss.selectableCellButton}
      data-test-select-item
      onClick={e => e.stopPropagation()}
    >
      <Checkbox name={`selected-${record.id}`} />
    </button>
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

    const fieldMatched = (fieldMarc || fieldNonMarc || existingStaticValueType).replace('_', ' ');

    return (
      <AppIcon
        size="small"
        app="data-import"
        iconKey={RECORD_TYPES[existingRecordType].icon}
        className={sharedCss.cellAppIcon}
      >
        {document.dir === 'ltr' &&
          <Fragment>
            <HighLight
              search={searchTerm}
              className={sharedCss.container}
            >
              {RECORD_TYPES[existingRecordType].caption}
            </HighLight>
            &middot;
            <HighLight
              search={searchTerm}
              className={sharedCss.container}
            >
              {field || existingRecordType}
            </HighLight>
            &rarr;
            <HighLight
              search={searchTerm}
              className={sharedCss.container}
            >
              {capitalize(fieldMatched, STRING_CAPITALIZATION_MODES.WORDS)}
            </HighLight>
          </Fragment>
        }
        {document.dir === 'rtl' &&
          <Fragment>
            <HighLight
              search={searchTerm}
              className={sharedCss.container}
            >
              {capitalize(fieldMatched, STRING_CAPITALIZATION_MODES.WORDS)}
            </HighLight>
            &larr;
            <HighLight
              search={searchTerm}
              className={sharedCss.container}
            >
              {field || existingRecordType}
            </HighLight>
            &middot;
            <HighLight
              search={searchTerm}
              className={sharedCss.container}
            >
              {RECORD_TYPES[existingRecordType].caption}
            </HighLight>
          </Fragment>
        }
      </AppIcon>
    );
  },
  tags: record => {
    const tags = get(record, 'tags.tagList', []);

    if (isEmpty(tags)) {
      return '-';
    }

    return (
      <span className={css.tags}>
        <Icon
          size="small"
          icon="tag"
          iconClassName={css.tagsIcon}
        />
        <HighLight
          search={searchTerm}
          className={sharedCss.container}
        >
          {tags.join(', ')}
        </HighLight>
      </span>
    );
  },
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return <DateFormatter value={updatedDate} />;
  },
  updatedBy: record => <UserNameFormatter value={record.userInfo} />,
});
