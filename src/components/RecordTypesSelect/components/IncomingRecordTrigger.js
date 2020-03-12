import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import classNames from 'classnames';

import css from '../RecordTypesSelect.css';

export const IncomingRecordTrigger = ({
  triggerRef,
  ariaProps,
  keyHandler,
  onClick,
  captionId,
  iconKey,
  className,
  isExpanded,
  style,
}) => (
  <Button
    buttonStyle="primary"
    buttonClass={classNames(css.item, className)}
    style={style}
    ref={triggerRef}
    onClick={onClick}
    onKeyDown={keyHandler}
    {...ariaProps}
  >
    {iconKey ? (
      <AppIcon
        size="medium"
        app="data-import"
        iconKey={iconKey}
      >
        <FormattedMessage id={captionId} />
      </AppIcon>
    ) : (
      <FormattedMessage id={captionId} />
    )}
    <Icon icon={`caret-${isExpanded ? 'up' : 'down'}`} />
  </Button>
);

IncomingRecordTrigger.propTypes = {
  triggerRef: PropTypes.object.isRequired,
  ariaProps: PropTypes.object.isRequired,
  keyHandler: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  captionId: PropTypes.string.isRequired,
  iconKey: PropTypes.string,
  className: PropTypes.string,
  isExpanded: PropTypes.bool,
  style: PropTypes.object,
};
