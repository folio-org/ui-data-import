import React from 'react';
import { Icon } from '@folio/stripes/components';

export const ACTION_TYPES = {
  CREATE: {
    icon: ({ label } = {}) => (
      <Icon
        size="small"
        icon="plus-sign"
        iconStyle="action"
      >
        {label}
      </Icon>
    ),
  },
  COMBINE: {
    icon: ({ label } = {}) => (
      <Icon
        size="small"
        icon="combine"
        iconStyle="action"
      >
        {label}
      </Icon>
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
      <Icon
        size="small"
        icon="replace"
        iconStyle="action"
      >
        {label}
      </Icon>
    ),
  },
};
