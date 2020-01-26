import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { AppIcon } from '@folio/stripes-core';
import { Button } from '@folio/stripes-components';

import css from '../ProfileTree.css';

export const LinkerButton = memo(({
  id,
  entityKey,
  onClick,
  searchLabel,
  className,
  dataAttributes,
}) => (
  <Button
    data-test-plugin-find-record-button
    aria-haspopup="true"
    buttonStyle="dropdownItem"
    id={`${id}-button-find-import-profile`}
    buttonClass={classNames(css['linker-button'], className)}
    marginTop0
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
  searchLabel: PropTypes.node || PropTypes.string,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};

LinkerButton.defaultProps = {
  className: '',
  searchLabel: '',
  dataAttributes: null,
};
