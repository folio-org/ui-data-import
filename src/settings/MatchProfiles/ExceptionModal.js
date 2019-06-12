import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Modal,
  Button,
} from '@folio/stripes/components';

export const ExceptionModal = memo(({
  id,
  showExceptionModal,
  onClose,
}) => (
  <Modal
    id={id}
    closeOnBackgroundClick
    open={showExceptionModal}
    label={<FormattedMessage id="ui-data-import.settings.matchProfiles.exceptionModal.label" />}
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
    <FormattedMessage id="ui-data-import.settings.matchProfiles.exceptionModal.message" />
  </Modal>
));

ExceptionModal.propTypes = {
  id: PropTypes.string,
  showExceptionModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
