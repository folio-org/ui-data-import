import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { AppIcon } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';

import css from '../ProfileTree.css';

export const LinkerButton = memo(({
  id,
  entityKey,
  onClick,
  searchLabel = '',
  className = '',
  dataAttributes = null,
}) => (
  <Button
    data-test-plugin-find-record-button
    role="menuitem"
    aria-haspopup="true"
    buttonStyle="dropdownItem"
    id={`${id}-button-find-import-profile-${entityKey}`}
    buttonClass={classNames(css['linker-button'], className)}
    marginBottom0
    onClick={() => onClick(entityKey)}
    {...dataAttributes}
  >
    <AppIcon
      size="small"
      app="data-import"
      iconKey={entityKey}
    >
      {searchLabel || <FormattedMessage id={`ui-data-import.settings.profiles.select.${entityKey}`} />}
    </AppIcon>
  </Button>
));

LinkerButton.propTypes = {
  id: PropTypes.string.isRequired,
  entityKey: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  searchLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};
