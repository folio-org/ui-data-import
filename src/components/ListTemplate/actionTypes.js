import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@folio/stripes/components';

import sharedCss from '../../shared.css';

const ActionIcon = ({
  label,
  icon,
}) => (
  <div className={sharedCss.modifyActionContainer}>
    <Icon
      size="small"
      icon={icon}
      iconStyle="action"
    />
    <span className={sharedCss.modifyActionIconLabel}>{label}</span>
  </div>
);

ActionIcon.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export const ACTION_TYPES = {
  CREATE: {
    icon: ({ label } = {}) => (
      <ActionIcon
        label={label}
        icon="plus-sign"
      />
    ),
  },
  COMBINE: {
    icon: ({ label } = {}) => (
      <ActionIcon
        label={label}
        icon="combine"
      />
    ),
  },
  MODIFY: {
    icon: ({ label } = {}) => (
      <ActionIcon
        label={label}
        icon="edit"
      />
    ),
  },
  REPLACE: {
    icon: ({ label } = {}) => (
      <ActionIcon
        label={label}
        icon="replace"
      />
    ),
  },
};
