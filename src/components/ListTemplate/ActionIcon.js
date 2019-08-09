import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import sharedCss from '../../shared.css';

export const ActionIcon = memo(({
  children,
  icon,
  size = 'small',
}) => (
  <div className={sharedCss.modifyActionContainer}>
    <Icon
      size={size}
      icon={icon}
      iconStyle="action"
    />
    <span className={sharedCss.modifyActionIconLabel}>{children}</span>
  </div>
));

ActionIcon.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
