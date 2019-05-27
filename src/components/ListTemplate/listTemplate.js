import React from 'react';

import { IntlConsumer } from '@folio/stripes/core';

import {
  CheckboxColumn,
  DefaultColumn,
  MatchColumn,
  TagsColumn,
  DateColumn,
} from './ColumnTemplates';
import { formatUserName } from '../../utils';

/**
 * Retrieves and returns list of Column Templates renderProps
 *
 * @param {string} entityKey
 * @param {string} searchTerm
 * @param {object} [selectRecord]
 * @param {array} [selectedRecords]
 * @return {object} templates list
 */
export const listTemplate = (entityKey, searchTerm, selectRecord, selectedRecords) => ({
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

    return (
      <IntlConsumer>
        {intl => intl.formatMessage({ id: fullTranslationId })}
      </IntlConsumer>
    );
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
});
