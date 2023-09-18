import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import {
  Button,
  DropdownMenu,
} from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { MATCH_INCOMING_RECORD_TYPES } from '../../../utils';

export const IncomingRecordMenu = ({
  open,
  onClick,
  onToggle,
  keyHandler,
  dataAttributes,
  existingRecordType,
}) => {
  const getIncomingRecordTypesOptions = (existingType) => {
    switch (existingType) {
      case FOLIO_RECORD_TYPES.INSTANCE.type: {
        return omit(MATCH_INCOMING_RECORD_TYPES, [
          MATCH_INCOMING_RECORD_TYPES.MARC_HOLDINGS.type,
          MATCH_INCOMING_RECORD_TYPES.MARC_AUTHORITY.type,
        ]);
      }

      default: {
        return omit(MATCH_INCOMING_RECORD_TYPES, [
          MATCH_INCOMING_RECORD_TYPES.MARC_HOLDINGS.type,
        ]);
      }
    }
  };
  const incomingRecordTypes = getIncomingRecordTypesOptions(existingRecordType);

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
      {Object.keys(incomingRecordTypes).map((recordType, i) => {
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
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  keyHandler: PropTypes.func.isRequired,
  dataAttributes: PropTypes.object,
  existingRecordType: PropTypes.string,
};

IncomingRecordMenu.defaultProps = { dataAttributes: null };
