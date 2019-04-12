import React, {
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneMenu,
  Icon,
  IconButton,
  Button,
} from '@folio/stripes/components';

import css from './FullScreenForm.css';

export const FullScreenForm = props => {
  const {
    id,
    children,
    onSubmit,
    paneTitle,
    onCancel,
    isSubmitDisabled,
    submitMessage,
  } = props;

  const closeButton = useRef();

  useEffect(() => closeButton.current.focus(), []);

  const firstMenu = (
    <PaneMenu>
      <FormattedMessage id="ui-data-import.close">
        {ariaLabel => (
          <IconButton
            data-test-close-button
            ariaLabel={ariaLabel}
            icon="times"
            ref={closeButton}
            onClick={onCancel}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  const lastMenu = (
    <PaneMenu>
      <Button
        data-test-submit-button
        type="submit"
        disabled={isSubmitDisabled}
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
      >
        {submitMessage}
      </Button>
    </PaneMenu>
  );

  const handleCancel = menu => {
    menu.onToggle();
    onCancel();
  };

  const renderActionMenu = menu => (
    <Button
      data-test-cancel-button
      buttonStyle="dropdownItem"
      onClick={() => handleCancel(menu)}
    >
      <Icon icon="times-circle">
        <FormattedMessage id="ui-data-import.cancel" />
      </Icon>
    </Button>
  );

  return (
    <form
      id={id}
      data-test-full-screen-form
      className={css.form}
      onSubmit={onSubmit}
    >
      <Pane
        defaultWidth="100%"
        actionMenu={renderActionMenu}
        firstMenu={firstMenu}
        lastMenu={lastMenu}
        paneTitle={paneTitle}
      >
        <div className={css.formContent}>
          {children}
        </div>
      </Pane>
    </form>
  );
};

FullScreenForm.propTypes = {
  paneTitle: PropTypes.node.isRequired,
  submitMessage: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  isSubmitDisabled: PropTypes.bool,
};

FullScreenForm.defaultProps = { isSubmitDisabled: false };
