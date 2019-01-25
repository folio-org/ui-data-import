import React, { Fragment } from 'react';
import { FormattedDate } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import css from './FileExtensions.css';

const resultsFormatter = intl => ({
  importBlocked: record => {
    const { importBlocked } = record;
    const translationIdEnding = `fileExtension${importBlocked ? 'Block' : 'Allow'}Import`;
    const fullTranslationId = `ui-data-import.settings.${translationIdEnding}`;

    return intl.formatMessage({ id: fullTranslationId });
  },
  dataTypes: record => {
    const { dataTypes } = record;

    const formattedDataTypes = dataTypes.map(type => {
      return type !== 'Delimited' ? type.toUpperCase() : type;
    });

    return formattedDataTypes.length > 0 ? formattedDataTypes.join(', ') : '-';
  },
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return (
      <Fragment>
        <Icon
          iconClassName={css.editIcon}
          icon="edit"
          size="small"
        >
          <FormattedDate value={updatedDate} />
        </Icon>
      </Fragment>
    );
  },
  updatedBy: record => {
    const { metadata: { updatedByUsername } } = record;

    if (updatedByUsername === 'System') {
      return updatedByUsername.toUpperCase();
    }

    return '';
  },
});

export default resultsFormatter;
