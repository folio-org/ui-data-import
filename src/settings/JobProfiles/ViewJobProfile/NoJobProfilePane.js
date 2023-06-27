import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Layout,
  Button,
  Headline,
  PaneHeader,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

import sharedCss from '../../../shared.css';

export const NoJobProfilePane = ({ onClose, history }) => {
  const renderPaneHeader = () => {
    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="jobProfiles"
      >
        <FormattedMessage id="ui-data-import.jobProfile.deleted" />
      </AppIcon>
    );

    return (
      <PaneHeader
        paneTitle={paneTitle}
        dismissible
        onClose={onClose}
      />
    );
  };

  return (
    <Pane
      data-test-pane-job-profile-details
      defaultWidth="fill"
      fluidContentWidth
      renderHeader={renderPaneHeader}
      id="view-job-profile-pane"
      padContent={false}
    >
      <Layout
        data-test-empty-msg
        className="textCentered"
      >
        <Headline
          className={sharedCss.headlineMargins}
          weight="medium"
          size="large"
          faded
        >
          <FormattedMessage id="ui-data-import.jobProfile.notAvailable" />
        </Headline>
        <Button
          buttonStyle="primary"
          onClick={() => history.go(-2)}
        >
          <FormattedMessage id="ui-data-import.returnToPreviousScreen" />
        </Button>
      </Layout>
    </Pane>
  );
};

NoJobProfilePane.propTypes = {
  history: PropTypes.shape({ go: PropTypes.func.isRequired }).isRequired,
  onClose: PropTypes.func.isRequired,
};
