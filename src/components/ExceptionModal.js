import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Modal,
  Button,
} from '@folio/stripes/components';

export const ExceptionModal = memo(({
  label,
  message,
  showExceptionModal,
  onClose,
  id,
}) => (
  <Modal
    id={id}
    closeOnBackgroundClick
    open={showExceptionModal}
    label={label}
    footer={(
      <Button
        data-test-exception-modal-close-button
        buttonStyle="primary"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-data-import.close" />
      </Button>
    )}
  >
    {message}
  </Modal>
));

ExceptionModal.propTypes = {
  label: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
  showExceptionModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string,
};
