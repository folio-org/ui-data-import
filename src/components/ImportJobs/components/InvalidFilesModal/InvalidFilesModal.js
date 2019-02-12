import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

const InvalidFilesModal = props => {
  const {
    open,
    onConfirm,
    onCancel,
  } = props;

  const message = (
    <FormattedMessage
      id="ui-data-import.modal.fileExtensions.message"
      values={{
        highlightedText: (
          <strong>
            <FormattedMessage id="ui-data-import.modal.fileExtensions.messageHighlightedText" />
          </strong>
        ),
      }}
    />
  );

  return (
    <ConfirmationModal
      open={open}
      heading={<FormattedMessage id="ui-data-import.modal.fileExtensions.header" />}
      message={message}
      confirmLabel={<FormattedMessage id="ui-data-import.modal.fileExtensions.actionButton" />}
      cancelLabel={<FormattedMessage id="ui-data-import.modal.fileExtensions.cancel" />}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

InvalidFilesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export { InvalidFilesModal };
