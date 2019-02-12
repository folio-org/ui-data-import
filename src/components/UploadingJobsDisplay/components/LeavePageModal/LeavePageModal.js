import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

const LeavePageModal = props => {
  const {
    open,
    onConfirm,
    onCancel,
  } = props;

  const message = (
    <FormattedMessage
      id="ui-data-import.modal.leavePage.message"
      values={{
        highlightedText: (
          <strong>
            <FormattedMessage id="ui-data-import.modal.leavePage.messageHighlightedText" />
          </strong>
        ),
      }}
    />
  );

  return (
    <ConfirmationModal
      open={open}
      heading={<FormattedMessage id="ui-data-import.modal.leavePage.header" />}
      message={message}
      confirmLabel={<FormattedMessage id="ui-data-import.modal.leavePage.actionButton" />}
      cancelLabel={<FormattedMessage id="ui-data-import.modal.leavePage.cancel" />}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

LeavePageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export { LeavePageModal };
