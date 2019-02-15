import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  Pane,
} from '@folio/stripes/components';

import { UploadingJobsDisplay } from '../components';

export class JobProfile extends Component {
  render() {
    return (
      <Paneset>
        <Pane
          defaultWidth="300px"
          paneTitle={<FormattedMessage id="ui-data-import.uploadingPaneTitle" />}
        >
          <UploadingJobsDisplay timeoutBeforeFileDeletion={10000} />
        </Pane>
      </Paneset>
    );
  }
}
