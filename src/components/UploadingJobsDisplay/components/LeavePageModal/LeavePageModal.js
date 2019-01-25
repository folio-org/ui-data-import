import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const LeavePageModal = props => {
  const {
    open,
    onConfirmModal,
    onCancelModal,
  } = props;
  const Footer = (
    <ModalFooter
      primaryButton={{
        label: <FormattedMessage id="ui-data-import.modal.leavePage.actionButton" />,
        onClick: onCancelModal,
      }}
      secondaryButton={{
        label: <FormattedMessage id="ui-data-import.modal.leavePage.cancel" />,
        onClick: onConfirmModal,
      }}
    />
  );

  return (
    <Modal
      open={open}
      label={<FormattedMessage id="ui-data-import.modal.leavePage.header" />}
      footer={Footer}
    >
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
    </Modal>
  );
};

LeavePageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirmModal: PropTypes.func.isRequired,
  onCancelModal: PropTypes.func.isRequired,
};

export default LeavePageModal;
