import React from 'react';

import {
  CheckboxColumn,
  DefaultColumn,
  ActionColumn,
  MatchColumn,
  TagsColumn,
  DateColumn,
} from './ColumnTemplates';
import { formatUserName } from '../../utils';
import { ENTITY_KEYS } from '../../utils/constants';

/**
 * Retrieves and returns list of Column Templates renderProps
 *
 * @param {{
 *   entityKey?: string, // A valid entity identifier
 *   searchTerm?: string,
 *   selectRecord?: (id: string) => void,
 *   selectedRecords?: Set<string>,
 *   intl?: object, // comes from IntlConsumer
 * }}
 * Note: check which params are required based on used columns
 */
export const listTemplate = ({
  entityKey,
  searchTerm,
  selectRecord,
  selectedRecords,
  intl,
}) => ({
  selected: record => (
    <CheckboxColumn
      value={record.id}
      checked={selectedRecords.has(record.id)}
      onChange={selectRecord}
    />
  ),
  name: record => (
    <DefaultColumn
      iconKey={entityKey}
      value={record.name}
      searchTerm={searchTerm}
    />
  ),
  match: record => (
    <MatchColumn
      record={record}
      searchTerm={searchTerm}
    />
  ),
  extension: record => (
    <DefaultColumn
      value={record.extension}
      searchTerm={searchTerm}
    />
  ),
  action: record => <ActionColumn record={record} />,
  mapping: record => (
    <DefaultColumn
      iconKey={ENTITY_KEYS.MAPPING_PROFILES}
      value={record.mapping || ''}
    />
  ),
  dataTypes: record => {
    const { dataTypes } = record;

    return (
      <DefaultColumn
        value={Array.isArray(dataTypes) ? dataTypes.join(', ') : ''}
        searchTerm={searchTerm}
      />
    );
  },
  importBlocked: record => {
    const { importBlocked } = record;
    const translationIdEnding = `fileExtension.${importBlocked ? 'block' : 'allow'}Import`;
    const fullTranslationId = `ui-data-import.settings.${translationIdEnding}`;

    return intl.formatMessage({ id: fullTranslationId });
  },
  tags: record => (
    <TagsColumn
      record={record}
      searchTerm={searchTerm}
    />
  ),
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return <DateColumn value={updatedDate} />;
  },
  updatedBy: record => (
    <DefaultColumn
      value={formatUserName(record.userInfo)}
      iconKey="user"
    />
  ),
  runBy: record => {
    const {
      runBy: {
        firstName,
        lastName,
      },
    } = record;

    return `${firstName} ${lastName}`;
  },
  completedDate: record => {
    const { completedDate } = record;

    return intl.formatTime(completedDate, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  },
  fileName: record => record.fileName,
});
