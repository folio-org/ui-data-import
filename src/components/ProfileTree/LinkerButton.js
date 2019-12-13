import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import {
  Pluggable,
  AppIcon,
} from '@folio/stripes-core';
import { Button } from '@folio/stripes-components';

import css from './ProfileTree.css';

export const LinkerButton = memo(({
  entityKey,
  searchLabel,
  className,
  onTypeSelected,
  onLinkCallback,
  dataAttributes,
}) => (
  <Pluggable
    type="find-import-profile"
    id="clickable-find-import-profile"
    addLines={onLinkCallback}
    entityKey={entityKey}
    dataKey={entityKey}
    disabled={false} // @TODO: Change this to actual value from LinkingRules object
    isSingleSelect
    isMultiLink
    {...dataAttributes}
    renderTrigger={({
      ref,
      onClick,
      ...rest
    }) => (
      <Button
        aria-haspopup="true"
        buttonRef={ref}
        buttonStyle="dropdownItem"
        id="clickable-find-import-profile"
        buttonClass={classNames(css['linker-button'], className)}
        marginTop0
        marginBottom0
        data-test-plugin-find-record-button
        {...rest}
        onClick={() => {
          onClick();
          onTypeSelected(entityKey);
        }}
      >
        <AppIcon
          size="small"
          app="data-import"
          iconKey={entityKey}
        >
          {searchLabel || <FormattedMessage id={`ui-data-import.settings.profiles.select.${entityKey}`} />}
        </AppIcon>
      </Button>
    )}
  >
    <span data-test-no-plugin-available>
      <FormattedMessage id="ui-data-import.find-import-profile-plugin-unavailable" />
    </span>
  </Pluggable>
));

LinkerButton.propTypes = {
  entityKey: PropTypes.string.isRequired,
  onTypeSelected: PropTypes.func.isRequired,
  onLinkCallback: PropTypes.func.isRequired,
  searchLabel: PropTypes.Node || PropTypes.string,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};

LinkerButton.defaultProps = {
  className: '',
  searchLabel: '',
  dataAttributes: null,
};
