/* fork of stripes-components' Confirmation modal that allows for disabling the cancelation button */

import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const focusFooterPrimary = ref => ref.current.focus();

const propTypes = {
  bodyTag: PropTypes.string,
  buttonStyle: PropTypes.string,
  cancelButtonStyle: PropTypes.string,
  cancelLabel: PropTypes.node,
  confirmLabel: PropTypes.node,
  heading: PropTypes.node.isRequired,
  id: PropTypes.string,
  isCancelButtonDisabled: PropTypes.bool,
  isConfirmButtonDisabled: PropTypes.bool,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const RunJobModal = (props) => {
  const footerPrimary = useRef(null);
  const contentId = useRef(uniqueId('modal-content')).current;
  const testId = props.id || uniqueId('confirmation-');
  const cancelLabel = props.cancelLabel || <FormattedMessage id="stripes-components.cancel" />;
  const confirmLabel = props.confirmLabel || <FormattedMessage id="stripes-components.submit" />;
  const {
    bodyTag: Element = 'p',
    onCancel,
    isConfirmButtonDisabled = false,
    isCancelButtonDisabled = false,
    buttonStyle = 'primary',
    cancelButtonStyle = 'default',
  } = props;

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirmation-modal-confirm-button
        buttonStyle={buttonStyle}
        id={`clickable-${testId}-confirm`}
        onClick={props.onConfirm}
        ref={footerPrimary}
        disabled={isConfirmButtonDisabled}
      >
        {confirmLabel}
      </Button>
      <Button
        data-test-confirmation-modal-cancel-button
        buttonStyle={cancelButtonStyle}
        id={`clickable-${testId}-cancel`}
        onClick={props.onCancel}
        disabled={isCancelButtonDisabled}
      >
        {cancelLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={props.open}
      onClose={onCancel}
      onOpen={() => { focusFooterPrimary(footerPrimary); }}
      id={testId}
      label={props.heading}
      aria-labelledby={contentId}
      scope="module"
      size="small"
      footer={footer}
    >
      <Element
        data-test-confirmation-modal-message
        style={{ margin: 0 }}
        id={contentId}
      >
        {props.message}
      </Element>
    </Modal>
  );
};

RunJobModal.propTypes = propTypes;

export default RunJobModal;
