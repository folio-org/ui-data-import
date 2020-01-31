import React, { memo } from 'react';
import HighLight from 'react-highlighter';
import PropTypes from 'prop-types';

import { AppIcon } from '@folio/stripes/core';

import sharedCss from '../../../shared.css';

export const DefaultColumn = memo(({
  value: incomingValue,
  customValue,
  className = sharedCss.cellAppIcon,
  iconKey,
  searchTerm,
}) => {
  if (!customValue && !incomingValue) {
    return '-';
  }

  const value = customValue || incomingValue;

  const content = searchTerm
    ? (
      <HighLight
        search={searchTerm || ''}
        className={sharedCss.container}
      >
        {value}
      </HighLight>
    )
    : value;

  if (!iconKey) {
    return content;
  }

  return (
    <AppIcon
      size="small"
      app="data-import"
      iconKey={iconKey}
      className={className}
    >
      {content}
    </AppIcon>
  );
});

DefaultColumn.propTypes = {
  value: PropTypes.string.isRequired,
  customValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconKey: PropTypes.string,
  className: PropTypes.string,
  searchTerm: PropTypes.string,
};
