import React, { memo } from 'react';
import HighLight from 'react-highlighter';
import PropTypes from 'prop-types';

import {
  NoValue,
  Button,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { PROFILE_TYPES_FOR_URL } from '../../../utils';

import sharedCss from '../../../shared.css';

export const DefaultColumn = memo(({
  value: incomingValue,
  customValue,
  className = sharedCss.cellAppIcon,
  iconKey,
  searchTerm,
  showLabelsAsHotLink,
  recordId,
}) => {
  if (!customValue && !incomingValue) {
    return <NoValue />;
  }

  const value = customValue || incomingValue;
  const entityName = iconKey ? PROFILE_TYPES_FOR_URL[iconKey] : '';

  const content = searchTerm
    ? (
      <HighLight
        search={searchTerm}
        className={sharedCss.container}
      >
        {value}
      </HighLight>
    )
    : value;

  if (!iconKey) {
    return content;
  }

  const appIcon = (
    <AppIcon
      size="small"
      app="data-import"
      iconKey={iconKey}
      className={className}
    >
      {content}
    </AppIcon>
  );

  const hotlink = (
    <Button
      data-test-profile-link={entityName}
      buttonStyle="link"
      marginBottom0
      to={`/settings/data-import/${entityName}/view/${recordId}`}
      buttonClass={sharedCss.cellLink}
    >
      {appIcon}
    </Button>
  );

  return showLabelsAsHotLink
    ? hotlink
    : appIcon;
});

DefaultColumn.propTypes = {
  value: PropTypes.string.isRequired,
  customValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconKey: PropTypes.string,
  className: PropTypes.string,
  searchTerm: PropTypes.string,
  showLabelsAsHotLink: PropTypes.bool,
  recordId: PropTypes.string,
};

DefaultColumn.defaultProps = {
  showLabelsAsHotLink: false,
  recordId: '',
};
