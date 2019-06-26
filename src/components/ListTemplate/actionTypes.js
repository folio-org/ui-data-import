/* eslint-disable react/prop-types */
import React from 'react';

import { AppIcon } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import sharedCss from '../../shared.css';

export const ACTION_TYPES = {
  CREATE: {
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="create"
        className={sharedCss.actionButton}
      >
        {label}
      </AppIcon>
    ),
  },
  COMBINE: {
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="combine"
        className={sharedCss.actionButton}
      >
        {label}
      </AppIcon>
    ),
  },
  MODIFY: {
    icon: ({ label } = {}) => (
      <div className={sharedCss.modifyActionContainer}>
        <Icon
          size="small"
          icon="edit"
          iconClassName={sharedCss.modifyActionIcon}
        />
        <span className={sharedCss.modifyActionIconLabel}>{label}</span>
      </div>
    ),
  },
  REPLACE: {
    icon: ({ label } = {}) => (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="replace"
        className={sharedCss.actionButton}
      >
        {label}
      </AppIcon>
    ),
  },
};
