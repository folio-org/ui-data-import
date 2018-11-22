import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Paneset,
  Pane,
} from '@folio/stripes/components';

import UploadingDisplay from '../components/UplaodingDisplay';


class JobProfile extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        acceptedFiles: PropTypes.array,
      }),
    }),
  };

  render = () => {
    const initUploadingState = get(this.props, 'location.state.acceptedFiles', []);

    return (
      <Paneset>
        <Pane
          defaultWidth="300px"
          paneTitle={<FormattedMessage id="ui-data-import.uploadingPaneTitle" />}
        >
          <UploadingDisplay initState={initUploadingState} />
        </Pane>
      </Paneset>
    );
  }
}

export default JobProfile;
