import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  Tooltip,
} from '@folio/stripes-components';

export const LinkerTrigger = ({
  title,
  triggerRef,
  ariaProps,
  keyHandler,
  onClick,
}) => (
  <>
    <Button
      buttonStyle="default"
      ref={triggerRef}
      aria-labelledby="linker-tooltip-text"
      aria-describedby="linker-tooltip-sub"
      onClick={onClick}
      onKeyDown={keyHandler}
      {...ariaProps}
    >
      <Icon
        icon="plus-sign"
        size="medium"
      />
    </Button>
    <Tooltip
      id="linker-tooltip"
      text={title || <FormattedMessage id="ui-data-import.settings.getStarted" />}
      triggerRef={triggerRef}
      placement="right-end"
    />
  </>
);

LinkerTrigger.propTypes = {
  title: PropTypes.node.isRequired || PropTypes.string.isRequired,
  triggerRef: PropTypes.object.isRequired,
  ariaProps: PropTypes.object.isRequired,
  keyHandler: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
