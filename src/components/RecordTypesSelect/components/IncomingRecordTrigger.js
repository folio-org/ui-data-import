import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { ALLOWED_INCOMING_RECORD_TYPES } from '../../../utils';

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
  incomingType,
  existingType,
  setIncomingRecord,
}) => {
  useEffect(() => {
    const allowedIncomingType = ALLOWED_INCOMING_RECORD_TYPES[existingType][incomingType];
    const incomingRecord = allowedIncomingType || FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC;

    setIncomingRecord(incomingRecord);
  }, [existingType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
};

IncomingRecordTrigger.propTypes = {
  triggerRef: PropTypes.object.isRequired,
  ariaProps: PropTypes.object.isRequired,
  keyHandler: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  captionId: PropTypes.string.isRequired,
  iconKey: PropTypes.string,
  className: PropTypes.string,
  isExpanded: PropTypes.bool,
  setIncomingRecord: PropTypes.func,
  incomingType: PropTypes.string,
  existingType: PropTypes.string,
  style: PropTypes.object,
};
