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
      <Icon
        size="small"
        icon="edit"
      >
        {label}
      </Icon>
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
