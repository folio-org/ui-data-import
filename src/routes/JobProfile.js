import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Paneset,
  Pane,
} from '@folio/stripes/components';

import UploadingJobsDisplay from '../components/UploadingJobsDisplay';

class JobProfile extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        acceptedFiles: PropTypes.array,
      }),
    }).isRequired,
  };

  render() {
    const files = get(this.props, 'location.state.acceptedFiles', []);

    return (
      <Paneset>
        <Pane
          defaultWidth="300px"
          paneTitle={<FormattedMessage id="ui-data-import.uploadingPaneTitle" />}
        >
          <UploadingJobsDisplay files={files} />
        </Pane>
      </Paneset>
    );
  }
}

export default JobProfile;
