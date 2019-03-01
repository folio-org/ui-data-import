import React from 'react';
import { FormattedDate } from 'react-intl';

import { Icon } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import css from './FileExtensions.css';

const formatUserName = userInfo => {
  const {
    firstName = '',
    lastName = '',
    userName = '',
  } = userInfo;

  if (userName === 'System') {
    return userName;
  }

  const formattedUserName = userName ? `(@${userName})` : userName;

  return `${firstName} ${lastName} ${formattedUserName}`;
};

export const resultsFormatter = intl => ({
  importBlocked: record => {
    const { importBlocked } = record;
    const translationIdEnding = `fileExtension.${importBlocked ? 'block' : 'allow'}Import`;
    const fullTranslationId = `ui-data-import.settings.${translationIdEnding}`;

    return intl.formatMessage({ id: fullTranslationId });
  },
  dataTypes: record => {
    const { dataTypes } = record;

    return dataTypes.length > 0 ? dataTypes.join(', ') : '-';
  },
  updated: record => {
    const { metadata: { updatedDate } } = record;

    return (
      <Icon
        iconClassName={css.editIcon}
        icon="edit"
        size="small"
      >
        <FormattedDate value={updatedDate} />
      </Icon>
    );
  },
  updatedBy: record => {
    const { userInfo } = record;

    return (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="user"
        className={css.userColumn}
      >
        {formatUserName(userInfo)}
      </AppIcon>
    );
  },
});
