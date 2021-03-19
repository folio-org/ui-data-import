import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FormattedTime } from '@folio/stripes/components';

import {
  CheckboxColumn,
  DefaultColumn,
  MappedColumn,
  ActionColumn,
  MatchColumn,
  TagsColumn,
  DateColumn,
} from './ColumnTemplates';
import {
  formatUserName,
  FILE_STATUSES,
} from '../../utils';

/**
 * Retrieves and returns list of Column Templates renderProps
 *
 * @param {{
 *   entityKey?: string, // A valid entity identifier
 *   searchTerm?: string,
 *   selectRecord?: (id: string) => void,
 *   selectedRecords?: Set<string>,
 *   showLabelsAsHotLink?: boolean,
 * }}
 * Note: check which params are required based on used columns
 */
export const listTemplate = ({
  entityKey,
  searchTerm,
  customValue,
  selectRecord,
  selectedRecords,
  showLabelsAsHotLink,
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
      customValue={customValue}
      searchTerm={searchTerm}
      showLabelsAsHotLink={showLabelsAsHotLink}
      recordId={record.id}
    />
  ),
  description: record => (
    <DefaultColumn
      value={record.description}
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
  action: record => (
    <ActionColumn
      record={record}
      searchTerm={searchTerm}
    />
  ),
  folioRecord: record => (
    <MappedColumn
      record={record}
      searchTerm={searchTerm}
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

    return <FormattedMessage id={fullTranslationId} />;
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
  status: record => {
    const {
      status,
      progress,
    } = record;

    if (status === FILE_STATUSES.ERROR) {
      if (progress && progress.current > 0) {
        return <FormattedMessage id="ui-data-import.completedWithErrors" />;
      }

      return <FormattedMessage id="ui-data-import.failed" />;
    }

    return <FormattedMessage id="ui-data-import.completed" />;
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

    return firstName ? `${firstName} ${lastName}` : `${lastName}`;
  },
  completedDate: record => {
    const { completedDate } = record;

    return (
      <FormattedTime
        value={completedDate}
        day="numeric"
        month="numeric"
        year="numeric"
      />
    );
  },
  jobProfileName: record => record.jobProfileInfo?.name,
  totalRecords: record => record.progress.total,
  fileName: record => record.fileName,
});
