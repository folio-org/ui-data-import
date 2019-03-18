import React from 'react';
import HighLight from 'react-highlighter';
import { FormattedDate } from 'react-intl';

import { Icon } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { SYSTEM_USER_NAME } from '../../utils/constants';

import css from './FileExtensions.css';

const formatUserName = userInfo => {
  const {
    firstName = '',
    lastName = '',
    userName = '',
  } = userInfo;

  if (userName === SYSTEM_USER_NAME) {
    return userName;
  }

  const formattedUserName = userName ? `(@${userName})` : userName;

  return `${firstName} ${lastName} ${formattedUserName}`;
};

export const resultsFormatter = (intl, searchTerm) => ({
  importBlocked: record => {
    const { importBlocked } = record;
    const translationIdEnding = `fileExtension.${importBlocked ? 'block' : 'allow'}Import`;
    const fullTranslationId = `ui-data-import.settings.${translationIdEnding}`;

    return intl.formatMessage({ id: fullTranslationId });
  },
  extension: record => {
    const { extension } = record;

    return <HighLight search={searchTerm}>{extension}</HighLight>;
  },
  dataTypes: record => {
    const { dataTypes } = record;

    if (!dataTypes.length) {
      return '-';
    }

    return <HighLight search={searchTerm}>{dataTypes.join(', ')}</HighLight>;
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
        <HighLight search={searchTerm}>{formatUserName(userInfo)}</HighLight>
      </AppIcon>
    );
  },
});
