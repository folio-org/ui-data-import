import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { AppIcon } from '@folio/stripes/core';

import { formatUserName } from '../../../utils';

import sharedCss from '../../../shared.css';

export const UserNameFormatter = memo(props => (
  <AppIcon
    size="small"
    app="data-import"
    iconKey="user"
    className={sharedCss.baseline}
  >
    {formatUserName(props.value)}
  </AppIcon>
));

UserNameFormatter.propTypes = {
  value: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
};
