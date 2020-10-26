import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  DropdownMenu,
} from '@folio/stripes-components';

import { INCOMING_RECORD_TYPES_TO_DISABLE } from '../../../utils';

import { MATCH_INCOMING_RECORD_TYPES } from '../../ListTemplate';

export const IncomingRecordMenu = ({
  open,
  onClick,
  onToggle,
  keyHandler,
  dataAttributes,
}) => (
  <DropdownMenu
    role="menu"
    placement="bottom-end"
    aria-label="available permissions"
    onToggle={onToggle}
    onKeyDown={keyHandler}
    open={open}
    minWidth="auto"
  >
    {Object.keys(MATCH_INCOMING_RECORD_TYPES).map((recordType, i) => {
      // TODO: Disabling options should be removed after implentation is done
      const isOptionDisabled = INCOMING_RECORD_TYPES_TO_DISABLE.some(option => option === recordType);

      return (
        <Button
          key={i}
          buttonStyle="dropdownItem"
          onClick={() => onClick(MATCH_INCOMING_RECORD_TYPES[recordType])}
          disabled={isOptionDisabled}
          role="menuitem"
          {...dataAttributes}
        >
          <FormattedMessage id={MATCH_INCOMING_RECORD_TYPES[recordType].captionId} />
        </Button>
      );
    })}
  </DropdownMenu>
);

IncomingRecordMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  keyHandler: PropTypes.func.isRequired,
  dataAttributes: PropTypes.object,
};

IncomingRecordMenu.defaultProps = { dataAttributes: null };
