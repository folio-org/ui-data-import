import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';

// TODO: view component will be developed in UIDATIMP-140
export class ViewMatchProfile extends Component {
  static manifest = Object.freeze({});
  static propTypes = { onClose: PropTypes.func.isRequired };

  render() {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-match-profile-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle="Match Profile Title"
        dismissible
        onClose={onClose}
      >
        <div>Match Profile Data</div>
      </Pane>
    );
  }
}
