import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import {
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const InvalidFilesModal = props => {
  const {
    isModalOpen,
    onConfirmModal,
    openFileUploadDialogWindow,
  } = props;
  const Footer = (
    <ModalFooter
      primaryButton={{
        label: <FormattedMessage id="ui-data-import.modal.actionButtonText" />,
        onClick: openFileUploadDialogWindow,
      }}
      secondaryButton={{
        label: <FormattedMessage id="ui-data-import.modal.cancel" />,
        onClick: onConfirmModal,
      }}
    />
  );

  return (
    <Modal
      open={isModalOpen}
      label={<FormattedMessage id="ui-data-import.modal.header" />}
      footer={Footer}
    >
      <FormattedMessage
        id="ui-data-import.modal.message"
        values={{
          highlightedText: (
            <strong>
              <FormattedMessage id="ui-data-import.modal.messageHighlightedText" />
            </strong>
          ),
        }}
      />
    </Modal>
  );
};

InvalidFilesModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onConfirmModal: PropTypes.func,
  openFileUploadDialogWindow: PropTypes.func,
};

InvalidFilesModal.defaultProps = {
  onConfirmModal: noop,
  openFileUploadDialogWindow: noop,
};

export default InvalidFilesModal;
