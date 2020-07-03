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
  id,
}) => (
  <>
    <Button
      buttonStyle="default"
      ref={triggerRef}
      aria-labelledby={`${id}-text`}
      aria-describedby={`${id}-sub`}
      onClick={onClick}
      onKeyDown={keyHandler}
      {...ariaProps}
    >
      <Icon
        icon="plus-sign"
        size="medium"
      />
    </Button>
    <div data-test-linker-tooltip-text>
      <Tooltip
        id={id}
        text={title || <FormattedMessage id="ui-data-import.settings.getStarted" />}
        triggerRef={triggerRef}
        placement="right-end"
      />
    </div>
  </>
);

LinkerTrigger.propTypes = {
  title: PropTypes.node.isRequired || PropTypes.string.isRequired,
  triggerRef: PropTypes.object.isRequired,
  ariaProps: PropTypes.object.isRequired,
  keyHandler: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
