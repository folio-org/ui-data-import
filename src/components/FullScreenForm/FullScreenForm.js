import React, {
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneMenu,
  IconButton,
  Button,
  PaneFooter,
} from '@folio/stripes/components';

import css from './FullScreenForm.css';

export const FullScreenForm = ({
  id,
  children,
  onSubmit,
  paneTitle,
  onCancel,
  isSubmitDisabled = false,
  submitMessage,
}) => {
  const headerCloseButtonRef = useRef();

  useEffect(() => headerCloseButtonRef.current.focus(), []);

  const firstMenu = (
    <PaneMenu>
      <FormattedMessage id="ui-data-import.close">
        {ariaLabel => (
          <IconButton
            data-test-header-close-button
            ariaLabel={ariaLabel}
            icon="times"
            ref={headerCloseButtonRef}
            onClick={onCancel}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  const closeButton = (
    <Button
      data-test-close-button
      marginBottom0
      buttonStyle="default mega"
      onClick={onCancel}
    >
      <FormattedMessage id="ui-data-import.close" />
    </Button>
  );

  const submitButton = (
    <Button
      data-test-submit-button
      type="submit"
      disabled={isSubmitDisabled}
      buttonStyle="primary mega"
      marginBottom0
    >
      {submitMessage}
    </Button>
  );

  const footer = (
    <PaneFooter
      renderStart={closeButton}
      renderEnd={submitButton}
    />
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
        paneTitle={paneTitle}
        firstMenu={firstMenu}
        footer={footer}
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
