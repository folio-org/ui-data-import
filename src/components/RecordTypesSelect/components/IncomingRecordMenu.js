import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  DropdownMenu,
} from '@folio/stripes/components';

import { MATCH_INCOMING_RECORD_TYPES } from '../../../utils';

export const IncomingRecordMenu = ({
  open,
  onClick,
  onToggle,
  keyHandler,
  incomingRecordOptions,
  dataAttributes = null,
}) => {
  return (
    <DropdownMenu
      role="menu"
      placement="bottom-end"
      aria-label="available permissions"
      onToggle={onToggle}
      onKeyDown={keyHandler}
      open={open}
      minWidth="auto"
    >
      {Object.keys(incomingRecordOptions).map((recordType, i) => {
        return (
          <Button
            key={i}
            buttonStyle="dropdownItem"
            onClick={() => onClick(MATCH_INCOMING_RECORD_TYPES[recordType])}
            role="menuitem"
            {...dataAttributes}
          >
            <FormattedMessage id={MATCH_INCOMING_RECORD_TYPES[recordType].captionId} />
          </Button>
        );
      })}
    </DropdownMenu>
  );
};

IncomingRecordMenu.propTypes = {
  incomingRecordOptions: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  keyHandler: PropTypes.func.isRequired,
  dataAttributes: PropTypes.object,
  existingRecordType: PropTypes.string,
};
