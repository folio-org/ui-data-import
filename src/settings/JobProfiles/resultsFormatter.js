import React from 'react';
import { get } from 'lodash';

import { AppIcon } from '@folio/stripes/core';
import { Checkbox } from '@folio/stripes/components';

import {
  DateFormatter,
  UserNameFormatter,
} from '../../components';

import sharedCss from '../../shared.css';

export const resultsFormatter = {
  selected: record => (
    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
      tabIndex="0"
      role="button"
      className={sharedCss.selectableCellButton}
      data-test-select-item
      onClick={e => e.stopPropagation()}
    >
      <Checkbox name={`selected-${record.id}`} />
    </div>
  ),
  name: record => (
    <AppIcon
      size="small"
      app="data-import"
      iconKey="jobProfiles"
      className={sharedCss.baseline}
    >
      {record.name}
    </AppIcon>
  ),
  tags: record => {
    const tags = get(record, 'tags.tagList', []);

    if (!tags.length) {
      return '-';
    }

    return tags.join(', ');
  },
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return <DateFormatter value={updatedDate} />;
  },
  updatedBy: record => <UserNameFormatter value={record.userInfo} />,
};
