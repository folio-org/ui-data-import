import React, { memo } from 'react';
import HighLight from 'react-highlighter';
import PropTypes from 'prop-types';

import { Button } from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

import { stringToWords } from '../../../utils';

import sharedCss from '../../../shared.css';

export const DefaultColumn = memo(({
  value: incomingValue,
  customValue,
  className = sharedCss.cellAppIcon,
  iconKey,
  searchTerm,
  showAsHotLink,
  recordId,
}) => {
  if (!customValue && !incomingValue) {
    return '-';
  }

  const value = customValue || incomingValue;

  const entityName = iconKey ? stringToWords(iconKey).map(word => word.toLocaleLowerCase()).join('-') : '';

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

  if (!iconKey) {
    return content;
  }

  return (
    <>
      {showAsHotLink ? (
        <Button
          data-test-profile-link
          buttonStyle="link"
          marginBottom0
          to={`/settings/data-import/${entityName}/view/${recordId}`}
          buttonClass={sharedCss.cellLink}
        >
          {appIcon}
        </Button>
      ) : appIcon }
    </>
  );
});

DefaultColumn.propTypes = {
  value: PropTypes.string.isRequired,
  customValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconKey: PropTypes.string,
  className: PropTypes.string,
  searchTerm: PropTypes.string,
  showAsHotLink: PropTypes.bool,
  recordId: PropTypes.string,
};

DefaultColumn.defaultProps = {
  showAsHotLink: false,
  recordId: '',
};
