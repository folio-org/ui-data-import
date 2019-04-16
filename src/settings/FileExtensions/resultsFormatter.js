import React from 'react';
import HighLight from 'react-highlighter';
import { isEmpty } from 'lodash';

import {
  DateFormatter,
  UserNameFormatter,
} from '../../components';

import sharedStyles from '../../shared.css';

export const resultsFormatter = (intl, searchTerm) => ({
  importBlocked: record => {
    const { importBlocked } = record;
    const translationIdEnding = `fileExtension.${importBlocked ? 'block' : 'allow'}Import`;
    const fullTranslationId = `ui-data-import.settings.${translationIdEnding}`;

    return intl.formatMessage({ id: fullTranslationId });
  },
  extension: record => (
    <HighLight
      className={sharedStyles.container}
      search={searchTerm}
    >
      {record.extension}
    </HighLight>
  ),
  dataTypes: record => {
    const { dataTypes } = record;

    if (isEmpty(dataTypes)) {
      return '-';
    }

    return (
      <HighLight
        className={sharedStyles.container}
        search={searchTerm}
      >
        {dataTypes.join(', ')}
      </HighLight>
    );
  },
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return <DateFormatter value={updatedDate} />;
  },
  updatedBy: record => <UserNameFormatter value={record.userInfo} />,
});
