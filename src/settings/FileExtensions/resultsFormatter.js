import React from 'react';
import HighLight from 'react-highlighter';

import {
  DateFormatter,
  UserNameFormatter,
} from '../../components';

export const resultsFormatter = (intl, searchTerm) => ({
  importBlocked: record => {
    const { importBlocked } = record;
    const translationIdEnding = `fileExtension.${importBlocked ? 'block' : 'allow'}Import`;
    const fullTranslationId = `ui-data-import.settings.${translationIdEnding}`;

    return intl.formatMessage({ id: fullTranslationId });
  },
  extension: record => <HighLight search={searchTerm}>{record.extension}</HighLight>,
  dataTypes: record => {
    const { dataTypes } = record;

    if (!dataTypes.length) {
      return '-';
    }

    return <HighLight search={searchTerm}>{dataTypes.join(', ')}</HighLight>;
  },
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return <DateFormatter value={updatedDate} />;
  },
  updatedBy: record => <UserNameFormatter value={record.userInfo} />,
});
