import React from 'react';
import { get } from 'lodash';

import { NoValue } from '@folio/stripes/components';

import {
  capitalize,
  formatUserName,
  getFieldMatched,
  HTML_LANG_DIRECTIONS,
  STRING_CAPITALIZATION_EXCLUSIONS,
  STRING_CAPITALIZATION_MODES,
} from '../../utils';

import { createActionLabel } from './ColumnTemplates';
import { FOLIO_RECORD_TYPES } from './folioRecordTypes';

/**
 * Retrieves and returns list of Search and Sort Column Templates
 */
export const searchAndSortTemplate = intl => ({
  name: record => record.name,
  description: record => record.description,
  match: record => {
    const fieldSource = (record.field || record.existingRecordType || '').replace(/_/g, ' ');
    const fieldsMatched = get(record, 'matchDetails[0].existingMatchExpression.fields', []).map(item => (item ? item.value || '' : ''));

    if (document.dir === HTML_LANG_DIRECTIONS.RIGHT_TO_LEFT) {
      fieldsMatched.reverse();
    }

    const fieldMatched = fieldsMatched.join('.');

    let part1;
    let part2;
    let part3;

    if (document.dir === HTML_LANG_DIRECTIONS.LEFT_TO_RIGHT) {
      part1 = intl.formatMessage({ id: FOLIO_RECORD_TYPES[record.existingRecordType].captionId });
      part2 = capitalize(fieldSource, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS);
      part3 = getFieldMatched(fieldMatched, fieldSource, intl.formatMessage);
    } else {
      part1 = capitalize(fieldMatched, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS);
      part2 = capitalize(fieldSource, STRING_CAPITALIZATION_MODES.WORDS, STRING_CAPITALIZATION_EXCLUSIONS);
      part3 = intl.formatMessage({ id: FOLIO_RECORD_TYPES[record.existingRecordType].captionId });
    }

    return `${part1} ${part2} ${part3}`;
  },
  extension: record => record.extension,
  action: record => createActionLabel(intl, record.action, record.folioRecord),
  mapping: record => record.mapping || <NoValue />,
  folioRecord: record => intl.formatMessage({ id: FOLIO_RECORD_TYPES[record.existingRecordType].captionId }),
  dataTypes: record => (Array.isArray(record.dataTypes) ? record.dataTypes.join(', ') : ''),
  importBlocked: record => {
    const { importBlocked } = record;
    const translationIdEnding = `fileExtension.${importBlocked ? 'block' : 'allow'}Import`;
    const fullTranslationId = `ui-data-import.settings.${translationIdEnding}`;

    return intl.formatMessage(fullTranslationId);
  },
  tags: record => record.tags.tagList.join(', '),
  updated: record => intl.formatDate(record.metadata.updatedDate),
  updatedBy: record => formatUserName(record.userInfo),
  runBy: record => `${record.firstName} ${record.lastName}`,
  completedDate: record => intl.formatTime(record.completedDate, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }),
  jobProfileName: record => record.jobProfileInfo?.name,
  totalRecords: record => record.progress.total,
  fileName: record => record.fileName,
});
