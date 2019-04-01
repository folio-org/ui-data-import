import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';

// TODO: view component will be developed in UIDATIMP-133
export class ViewJobProfile extends Component {
  static manifest = Object.freeze({});

  static propTypes = { onClose: PropTypes.func.isRequired };

  render() {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-job-profile-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle="Content title"
        dismissible
        onClose={onClose}
      >
        <div>Content</div>
      </Pane>
    );
  }
}
