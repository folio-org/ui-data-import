import React from 'react';
import HighLight from 'react-highlighter';

import { AppIcon } from '@folio/stripes/core';
import { Checkbox } from '@folio/stripes/components';

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
