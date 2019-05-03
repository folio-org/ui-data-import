import React from 'react';
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

import {
  DateFormatter,
  UserNameFormatter,
} from '../../components';

import sharedCss from '../../shared.css';
import css from './JobProfiles.css';

export const resultsFormatter = (searchTerm, selectRecord, selectedRecords) => ({
  selected: record => (
    <button
      type="button"
      className={sharedCss.selectableCellButton}
      data-test-select-item
      onClick={e => e.stopPropagation()}
    >
      <Checkbox
        name={`selected-${record.id}`}
        checked={selectedRecords.has(record.id)}
        onChange={() => selectRecord(record.id)}
      />
    </button>
  ),
  name: record => (
    <AppIcon
      size="small"
      app="data-import"
      iconKey="jobProfiles"
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
