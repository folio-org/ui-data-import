import React, { memo } from 'react';
import HighLight from 'react-highlighter';
import PropTypes from 'prop-types';

import { AppIcon } from '@folio/stripes/core';

import sharedCss from '../../../../shared.css';

export const DefaultColumn = memo(props => {
  const {
    value,
    className,
    iconKey,
    searchTerm,
  } = props;

  const content = searchTerm ? (
    <HighLight
      search={searchTerm}
      className={sharedCss.container}
    >
      {value}
    </HighLight>
  ) : value;
  console.log('Value: ', content, searchTerm);
  if (!iconKey) {
    return content;
  }

  return (
    <AppIcon
      size="small"
      app="data-import"
      iconKey={iconKey}
      className={className || sharedCss.cellAppIcon}
    >
      {content}
    </AppIcon>
  );
});

DefaultColumn.propTypes = {
  value: PropTypes.string.isRequired,
  iconKey: PropTypes.string,
  className: PropTypes.string,
  searchTerm: PropTypes.string,
};

DefaultColumn.defaultTypes = { className: sharedCss.cellAppIcon };
