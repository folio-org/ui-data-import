import React, { memo } from 'react';
import HighLight from 'react-highlighter';
import PropTypes from 'prop-types';

import { AppIcon } from '@folio/stripes/core';

import sharedCss from '../../../shared.css';

export const DefaultFormatter = memo(props => {
  const {
    value,
    className,
    iconKey,
    searchTerm,
  } = props;

  return (
    <AppIcon
      size="small"
      app="data-import"
      iconKey={iconKey}
      className={className || sharedCss.cellAppIcon}
    >
      {searchTerm ? (
        <HighLight
          search={searchTerm}
          className={sharedCss.container}
        >
          {value}
        </HighLight>
      ) : value}
    </AppIcon>
  );
});

DefaultFormatter.propTypes = {
  value: PropTypes.string.isRequired,
  iconKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  searchTerm: PropTypes.string,
};
